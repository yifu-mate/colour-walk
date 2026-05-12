import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Users, MapPin, Navigation, RefreshCw } from 'lucide-react';

interface GeoLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

interface MapColorPoint {
  x: number;
  y: number;
  color: string;
  colorName: string;
  colorNameEn: string;
  mood: string;
  count: number;
}

const familyColorMap: Record<string, string> = {
  '红色系': '#E53935',
  '橙色系': '#FB8C00',
  '黄色系': '#FDD835',
  '绿色系': '#43A047',
  '青色系': '#009688',
  '蓝色系': '#1E88E5',
  '紫色系': '#8E24AA',
  '粉色系': '#F06292',
  '中性色': '#9E9E9E',
};

function getColorFamily(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (s < 0.1) return '中性色';
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  h *= 360;

  if (h < 15 || h >= 345) return '红色系';
  if (h < 45) return '橙色系';
  if (h < 75) return '黄色系';
  if (h < 150) return '绿色系';
  if (h < 195) return '青色系';
  if (h < 255) return '蓝色系';
  if (h < 285) return '紫色系';
  return '粉色系';
}

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { todayThemeColor, nearbyUsers, setNearbyUsers, currentCollection } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MapColorPoint | null>(null);

  const mockColors = [
    { color: '#1E88E5', name: '道奇蓝', nameEn: 'Dodger Blue', mood: '活力' },
    { color: '#90CAF9', name: '冰蓝', nameEn: 'Ice Blue', mood: '清透' },
    { color: '#E57373', name: '玫瑰粉', nameEn: 'Rose Pink', mood: '柔美' },
    { color: '#81C784', name: '嫩绿', nameEn: 'Spring Green', mood: '希望' },
    { color: '#FFD54F', name: '麦穗黄', nameEn: 'Wheat Yellow', mood: '丰收' },
    { color: '#BA68C8', name: '丁香紫', nameEn: 'Lilac', mood: '梦幻' },
    { color: '#FF8A65', name: '暮光橙', nameEn: 'Twilight Orange', mood: '温柔' },
    { color: '#4DB6AC', name: '薄荷青', nameEn: 'Mint Cyan', mood: '清爽' },
    { color: '#F06292', name: '洋红', nameEn: 'Fuchsia', mood: '热情' },
    { color: '#4A148C', name: '暗紫', nameEn: 'Dark Purple', mood: '神秘' },
  ];

  const colorPoints = useMemo<MapColorPoint[]>(() => {
    const points: MapColorPoint[] = [];
    const userCaptures = currentCollection?.captures || [];

    userCaptures.forEach((capture, i) => {
      const angle = (i / Math.max(userCaptures.length, 1)) * Math.PI * 2;
      const dist = 0.15 + Math.random() * 0.15;
      points.push({
        x: 0.5 + Math.cos(angle) * dist,
        y: 0.5 + Math.sin(angle) * dist,
        color: capture.primaryColor,
        colorName: capture.colorName,
        colorNameEn: capture.colorNameEn,
        mood: capture.moodTags[0] || '',
        count: 1,
      });
    });

    for (let i = 0; i < 50; i++) {
      const mc = mockColors[i % mockColors.length];
      const angle = (i / 50) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 0.1 + Math.random() * 0.35;
      points.push({
        x: 0.5 + Math.cos(angle) * dist,
        y: 0.5 + Math.sin(angle) * dist,
        color: mc.color,
        colorName: mc.name,
        colorNameEn: mc.nameEn,
        mood: mc.mood,
        count: Math.floor(Math.random() * 5) + 1,
      });
    }

    return points;
  }, [currentCollection]);

  const regionSummary = useMemo(() => {
    const familyCounts: Record<string, { count: number; colors: Set<string> }> = {};
    colorPoints.forEach(p => {
      const family = getColorFamily(p.color);
      if (!familyCounts[family]) {
        familyCounts[family] = { count: 0, colors: new Set() };
      }
      familyCounts[family].count += p.count;
      familyCounts[family].colors.add(p.colorName);
    });

    return Object.entries(familyCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 4)
      .map(([family, data]) => ({
        family,
        count: data.count,
        topColors: Array.from(data.colors).slice(0, 2),
      }));
  }, [colorPoints]);

  useEffect(() => {
    getUserLocation();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    drawCityMoodMap();
  }, [colorPoints]);

  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('您的浏览器不支持地理位置');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsLocating(false);
        setNearbyUsers(Math.floor(Math.random() * 30) + 5);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('请允许获取您的位置以获得更好的体验');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('无法获取您的位置信息');
            break;
          case error.TIMEOUT:
            setLocationError('获取位置超时，请重试');
            break;
        }
        setIsLocating(false);
        setNearbyUsers(Math.floor(Math.random() * 50) + 10);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const drawCityMoodMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#F0EDE8';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 8; i++) {
        const x = width * (0.15 + (i % 4) * 0.25) + Math.sin(time + i) * 15;
        const y = height * (0.25 + Math.floor(i / 4) * 0.5) + Math.cos(time + i * 0.7) * 15;
        ctx.strokeStyle = 'rgba(180,175,168,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 40, y);
        ctx.lineTo(x + 40, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x, y + 30);
        ctx.stroke();
      }

      for (let i = 0; i < 5; i++) {
        const y = height * (0.15 + i * 0.18);
        ctx.strokeStyle = 'rgba(180,175,168,0.08)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * 0.3, y + 20, width * 0.7, y - 20, width, y);
        ctx.stroke();
      }

      colorPoints.forEach((point, index) => {
        const baseX = point.x * width;
        const baseY = point.y * height;
        const x = baseX + Math.sin(time * 0.8 + index * 0.5) * 8;
        const y = baseY + Math.cos(time * 0.6 + index * 0.3) * 8;
        const baseRadius = 20 + point.count * 8;
        const radius = baseRadius + Math.sin(time + index) * 5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, point.color + '70');
        gradient.addColorStop(0.4, point.color + '40');
        gradient.addColorStop(0.7, point.color + '15');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = point.color + 'CC';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      const cx = width * 0.5;
      const cy = height * 0.5;
      const pulseR = 12 + Math.sin(time * 2) * 4;

      const userGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR * 3);
      userGlow.addColorStop(0, todayThemeColor + '50');
      userGlow.addColorStop(0.5, todayThemeColor + '20');
      userGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = userGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = todayThemeColor;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    let closest: MapColorPoint | null = null;
    let closestDist = Infinity;

    colorPoints.forEach(point => {
      const px = point.x * canvas.width;
      const py = point.y * canvas.height;
      const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);
      if (dist < 50 && dist < closestDist) {
        closestDist = dist;
        closest = point;
      }
    });

    setSelectedPoint(closest);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-white to-soft-gray pb-24">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center soft-shadow"
            >
              <ArrowLeft size={20} className="text-text-dark" />
            </button>
            <h1 className="text-xl font-light text-text-dark">城市情绪</h1>
          </div>
          <button
            onClick={getUserLocation}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center soft-shadow"
          >
            {isLocating ? (
              <RefreshCw size={18} className="text-text-medium animate-spin" />
            ) : (
              <Navigation size={18} className="text-text-medium" />
            )}
          </button>
        </div>

        <motion.div
          className="relative rounded-3xl overflow-hidden soft-shadow mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-80 object-cover cursor-pointer"
            onClick={handleCanvasClick}
          />

          <div className="absolute top-4 left-4">
            <div className="glass-effect rounded-full px-4 py-2">
              <p className="text-text-dark text-xs font-light">整座城市正在呼吸</p>
            </div>
          </div>

          {selectedPoint && (
            <motion.div
              className="absolute bottom-4 left-4 right-4 glass-effect rounded-2xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: selectedPoint.color }}
                />
                <div>
                  <p className="text-text-dark font-light">
                    {selectedPoint.colorName}
                    <span className="text-text-medium text-xs ml-2">{selectedPoint.colorNameEn}</span>
                  </p>
                  <p className="text-text-medium text-xs">{selectedPoint.mood}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="glass-effect rounded-2xl p-4 mb-4 soft-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: todayThemeColor }} />
              <span className="text-sm text-text-dark font-light">
                附近有<span className="font-medium" style={{ color: todayThemeColor }}>{nearbyUsers}</span>个人正在寻找颜色
              </span>
            </div>
            {userLocation ? (
              <div className="flex items-center gap-1">
                <MapPin size={14} style={{ color: todayThemeColor }} />
                <span className="text-xs text-text-medium">
                  {userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)}
                </span>
              </div>
            ) : (
              <button
                onClick={getUserLocation}
                className="flex items-center gap-1 text-xs"
                style={{ color: todayThemeColor }}
              >
                <Navigation size={12} />
                <span>开启定位</span>
              </button>
            )}
          </div>
          {locationError && (
            <p className="text-xs text-red-400 mt-2">{locationError}</p>
          )}
        </motion.div>

        <div className="mb-4">
          <h3 className="text-base font-light text-text-dark mb-3">城市色彩分布</h3>
          <div className="space-y-3">
            {regionSummary.map((region) => (
              <motion.div
                key={region.family}
                className="glass-effect rounded-2xl p-4 soft-shadow"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: familyColorMap[region.family] || '#999' }}
                    />
                    <span className="text-sm text-text-dark font-light">{region.family}</span>
                  </div>
                  <span className="text-xs text-text-medium">{region.count} 处</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {region.topColors.map((color) => (
                    <span
                      key={color}
                      className="text-xs px-2 py-1 rounded-full font-light"
                      style={{
                        backgroundColor: (familyColorMap[region.family] || '#999') + '20',
                        color: familyColorMap[region.family] || '#999',
                      }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {currentCollection?.captures && currentCollection.captures.length > 0 && (
          <motion.div
            className="glass-effect rounded-2xl p-4 soft-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-base font-light text-text-dark mb-3">你的今日足迹</h3>
            <div className="flex gap-4">
              {currentCollection.captures.map((capture) => (
                <div key={capture.id} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl"
                    style={{ backgroundColor: capture.primaryColor }}
                  />
                  <div>
                    <p className="text-xs text-text-dark">{capture.colorName}</p>
                    <p className="text-xs text-text-medium">{capture.objectType}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20">
        <div className="flex justify-around items-center py-6 max-w-md mx-auto">
          <button
            onClick={() => navigate('/map')}
            className="flex flex-col items-center gap-2"
            style={{ color: todayThemeColor }}
          >
            <span className="text-xs font-light">地图</span>
          </button>
          <button
            onClick={() => navigate('/collection')}
            className="flex flex-col items-center gap-2 text-text-medium"
          >
            <span className="text-xs font-light">收藏册</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-2 text-text-medium"
          >
            <span className="text-xs font-light">我的情绪</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
