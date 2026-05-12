import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { X, Camera, Check, ImagePlus } from 'lucide-react';
import { ColorCapture } from '../types';
import { findClosestColor, hslToRgb } from '../utils/colorDatabase';

const WalkPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    todayThemeColor, 
    addCapture, 
    completeWalk,
    endWalk 
  } = useAppStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCapture, setLastCapture] = useState<ColorCapture | null>(null);
  const [captures, setCaptures] = useState<ColorCapture[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string;
      
      const recognitionResult = await recognizeColorFromImage(imageUrl);
      
      const capture: ColorCapture = {
        id: `capture-${Date.now()}`,
        imageUrl,
        primaryColor: recognitionResult.primaryColor,
        colorName: recognitionResult.colorName,
        colorNameEn: recognitionResult.colorNameEn,
        colorFamily: recognitionResult.colorFamily,
        objectType: recognitionResult.objectType,
        moodTags: [recognitionResult.mood],
        capturedAt: new Date(),
      };
      
      setLastCapture(capture);
      setCaptures(prev => [...prev, capture]);
      addCapture(capture);
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenCamera = () => {
    fileInputRef.current?.click();
  };

  const handleFinishWalk = () => {
    if (captures.length > 0) {
      completeWalk();
      navigate('/collection');
    } else {
      endWalk();
      navigate('/');
    }
  };

  const recognizeColorFromImage = (imageUrl: string): Promise<{
    primaryColor: string;
    colorName: string;
    colorNameEn: string;
    colorFamily: string;
    objectType: string;
    mood: string;
  }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            primaryColor: todayThemeColor,
            colorName: '未知色',
            colorNameEn: 'Unknown',
            colorFamily: '灰',
            objectType: '物体',
            mood: '平静',
          });
          return;
        }

        const sampleSize = 200;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const pixels = imageData.data;

        const allPixels: { r: number; g: number; b: number; h: number; s: number; l: number }[] = [];
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          const hsl = rgbToHsl(r, g, b);
          allPixels.push({ r, g, b, ...hsl });
        }

        const validPixels = allPixels.filter(p => p.l >= 5 && p.l <= 95);

        if (validPixels.length === 0) {
          resolve({
            primaryColor: todayThemeColor,
            colorName: '未知色',
            colorNameEn: 'Unknown',
            colorFamily: '灰',
            objectType: '物体',
            mood: '平静',
          });
          return;
        }

        const chromaticPixels = validPixels.filter(p => p.s >= 10);

        let dominantR: number, dominantG: number, dominantB: number;

        if (chromaticPixels.length > validPixels.length * 0.15) {
          const hueGroups: Map<number, { r: number; g: number; b: number; count: number }> = new Map();

          for (const pixel of chromaticPixels) {
            const bucket = Math.round(pixel.h / 30) * 30;
            const existing = hueGroups.get(bucket);
            if (existing) {
              existing.r += pixel.r;
              existing.g += pixel.g;
              existing.b += pixel.b;
              existing.count++;
            } else {
              hueGroups.set(bucket, { r: pixel.r, g: pixel.g, b: pixel.b, count: 1 });
            }
          }

          let maxCount = 0;
          let dominantGroup = { r: 0, g: 0, b: 0, count: 1 };
          for (const group of hueGroups.values()) {
            if (group.count > maxCount) {
              maxCount = group.count;
              dominantGroup = group;
            }
          }

          dominantR = Math.round(dominantGroup.r / dominantGroup.count);
          dominantG = Math.round(dominantGroup.g / dominantGroup.count);
          dominantB = Math.round(dominantGroup.b / dominantGroup.count);
        } else {
          const totalR = validPixels.reduce((sum, p) => sum + p.r, 0);
          const totalG = validPixels.reduce((sum, p) => sum + p.g, 0);
          const totalB = validPixels.reduce((sum, p) => sum + p.b, 0);
          const count = validPixels.length;
          dominantR = Math.round(totalR / count);
          dominantG = Math.round(totalG / count);
          dominantB = Math.round(totalB / count);
        }

        const dominantHsl = rgbToHsl(dominantR, dominantG, dominantB);
        let matchR = dominantR, matchG = dominantG, matchB = dominantB;

        if (dominantHsl.s > 10 && dominantHsl.l < 25) {
          const boosted = hslToRgb(dominantHsl.h, dominantHsl.s, Math.max(dominantHsl.l, 30));
          matchR = boosted.r;
          matchG = boosted.g;
          matchB = boosted.b;
        }

        const primaryColor = `#${dominantR.toString(16).padStart(2, '0')}${dominantG.toString(16).padStart(2, '0')}${dominantB.toString(16).padStart(2, '0')}`;
        const swatch = findClosestColor(matchR, matchG, matchB);
        const objectType = inferObjectType(dominantR, dominantG, dominantB);

        resolve({
          primaryColor,
          colorName: swatch.name,
          colorNameEn: swatch.nameEn,
          colorFamily: swatch.family,
          objectType,
          mood: swatch.mood,
        });
      };

      img.onerror = () => {
        resolve({
          primaryColor: todayThemeColor,
          colorName: '未知色',
          colorNameEn: 'Unknown',
          colorFamily: '灰',
          objectType: '物体',
          mood: '平静',
        });
      };

      img.src = imageUrl;
    });
  };

  const inferObjectType = (r: number, g: number, b: number) => {
    const hsl = rgbToHsl(r, g, b);
    const { h, s, l } = hsl;

    if (s < 10 && l > 70) return '白云';
    if (s < 10 && l < 30) return '阴影';
    if (h >= 80 && h <= 165 && s > 15 && l > 15) return '树叶';
    if (h >= 195 && h <= 255 && s > 20 && l > 30) return '天空';
    if (h >= 195 && h <= 255 && s > 15 && l <= 30) return '水面';
    if (h >= 0 && h <= 45 && s > 30 && l > 40) return '夕阳';
    if (h >= 0 && h <= 30 && s > 15 && l > 10) return '红墙';
    if (h >= 200 && h <= 250 && s > 15 && l > 10 && l < 40) return '玻璃';
    if (h >= 30 && h <= 50 && s > 30 && l > 40) return '沙地';
    if (h >= 30 && h <= 55 && s > 15 && l > 10) return '木材';
    if (s < 15 && l > 80) return '墙面';
    if (s < 20 && l < 70 && l > 30) return '路面';

    return '物体';
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: todayThemeColor + '15' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              `radial-gradient(circle at 30% 40%, ${todayThemeColor}40, transparent 60%)`,
              `radial-gradient(circle at 70% 60%, ${todayThemeColor}40, transparent 60%)`,
              `radial-gradient(circle at 30% 40%, ${todayThemeColor}40, transparent 60%)`,
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.div
          className="p-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => { endWalk(); navigate('/'); }}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center"
          >
            <X size={20} className="text-text-dark" />
          </button>
          
          <div className="glass-effect rounded-full px-4 py-2">
            <span className="text-text-dark text-sm font-light">
              已收集 <span style={{ color: todayThemeColor }} className="font-medium">{captures.length}</span> 种颜色
            </span>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {captures.length === 0 ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-40 h-40 rounded-full mx-auto mb-8"
                style={{ backgroundColor: todayThemeColor + '30' }}
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="text-text-medium font-light text-lg mb-2">
                去寻找你身边的颜色
              </p>
              <p className="text-text-medium/60 text-sm font-light">
                拍下你发现的色彩，想拍多少张都可以
              </p>
            </motion.div>
          ) : (
            <div className="w-full max-w-sm">
              <div className="space-y-4 mb-6">
                {captures.map((capture, index) => (
                  <motion.div
                    key={capture.id}
                    className="glass-effect rounded-2xl overflow-hidden soft-shadow"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex">
                      <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden">
                        <img
                          src={capture.imageUrl}
                          alt={capture.colorName}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{ backgroundColor: capture.primaryColor }}
                        />
                      </div>
                      <div className="p-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-5 h-5 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: capture.primaryColor }}
                          />
                          <span className="text-text-dark font-light text-base truncate">
                            {capture.colorName}
                          </span>
                          <span className="text-text-medium text-xs">
                            {capture.colorNameEn}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-medium">
                          <span className="font-mono">{capture.primaryColor.toUpperCase()}</span>
                          <span>·</span>
                          <span>{capture.objectType}</span>
                          <span>·</span>
                          <span>{capture.moodTags[0]}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {lastCapture && (
                <motion.div
                  className="text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-text-medium font-light italic text-sm leading-relaxed">
                    "你找到了{lastCapture.colorName}，{lastCapture.moodTags[0]}的颜色。"
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="p-8 pb-12">
          <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
            <motion.button
              onClick={handleOpenCamera}
              disabled={isProcessing}
              className="flex-1 py-4 rounded-2xl text-white font-light tracking-wide flex items-center justify-center gap-2 soft-shadow"
              style={{ backgroundColor: todayThemeColor }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? (
                <motion.div
                  className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <Camera size={20} />
                  <span>拍照</span>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md flex items-center justify-center soft-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ImagePlus size={22} className="text-text-medium" />
            </motion.button>
          </div>

          {captures.length > 0 && (
            <motion.button
              onClick={handleFinishWalk}
              className="w-full mt-4 py-3 rounded-2xl glass-effect text-text-dark font-light tracking-wide flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check size={18} />
              <span>完成本次 Walk</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalkPage;
