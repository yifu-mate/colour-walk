import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, TrendingUp, Calendar, Award, Sparkles } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { todayThemeColor, currentCollection, dailyAnalysis } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captures = currentCollection?.captures || [];
  const hasData = captures.length > 0;

  const stats = useMemo(() => {
    if (!hasData) return null;

    const colorCounts: Record<string, number> = {};
    const moodCounts: Record<string, number> = {};
    const objectCounts: Record<string, number> = {};
    const familyCounts: Record<string, number> = {};

    captures.forEach(capture => {
      colorCounts[capture.colorName] = (colorCounts[capture.colorName] || 0) + 1;
      capture.moodTags.forEach(tag => {
        moodCounts[tag] = (moodCounts[tag] || 0) + 1;
      });
      objectCounts[capture.objectType] = (objectCounts[capture.objectType] || 0) + 1;
      if (capture.colorFamily) {
        familyCounts[capture.colorFamily] = (familyCounts[capture.colorFamily] || 0) + 1;
      }
    });

    const favoriteColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color);

    const topMood = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0];

    const topObject = Object.entries(objectCounts)
      .sort(([, a], [, b]) => b - a)[0];

    const isWarm = Object.keys(familyCounts).some(f => ['红', '橙', '黄'].includes(f));
    const isCool = Object.keys(familyCounts).some(f => ['蓝', '青', '绿'].includes(f));
    const isNeutral = Object.keys(familyCounts).some(f => ['灰'].includes(f));

    let personalityType = '探索者';
    let currentPhase = '发现期';

    if (isCool && !isWarm) {
      personalityType = '沉思者';
      currentPhase = '安静观察期';
    } else if (isWarm && !isCool) {
      personalityType = '感受者';
      currentPhase = '热情探索期';
    } else if (isNeutral) {
      personalityType = '观察者';
      currentPhase = '内省期';
    } else if (isWarm && isCool) {
      personalityType = '平衡者';
      currentPhase = '多元感知期';
    }

    return {
      favoriteColors,
      topMood: topMood ? topMood[0] : '平和',
      topObject: topObject ? topObject[0] : '物体',
      personalityType,
      currentPhase,
      totalWalks: currentCollection?.isComplete ? 1 : 0,
      totalCaptures: captures.length,
    };
  }, [captures, hasData, currentCollection]);

  useEffect(() => {
    if (hasData) {
      drawColorCurve();
    }
  }, [hasData]);

  const drawColorCurve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = todayThemeColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const points = captures.map((capture, index) => {
      const x = (index / Math.max(captures.length - 1, 1)) * width;
      const hex = capture.primaryColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = ((max + min) / 2) / 255;
      const y = (1 - l) * height * 0.8 + height * 0.1;
      return { x, y, color: capture.primaryColor };
    });

    if (points.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const cpX = (points[i - 1].x + points[i].x) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cpX, (points[i - 1].y + points[i].y) / 2);
    }

    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = point.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-white to-soft-gray pb-24">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center soft-shadow"
          >
            <ArrowLeft size={20} className="text-text-dark" />
          </button>
          <h1 className="text-xl font-light text-text-dark">我的情绪</h1>
        </div>

        {!hasData ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-48 h-48 rounded-full mb-8 flex items-center justify-center"
              style={{ backgroundColor: todayThemeColor + '20' }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Sparkles size={48} className="text-text-medium" strokeWidth={1} />
            </motion.div>
            <p className="text-text-medium text-center font-light leading-relaxed max-w-xs">
              完成一次Walk后，<br />
              你的情绪记录将会出现在这里
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="glass-effect rounded-3xl p-6 mb-6 soft-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-lg font-light text-text-dark mb-4">色彩人格分析</h2>
              
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: todayThemeColor }}
                >
                  <Award size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-text-dark font-light text-lg">{stats?.personalityType}</p>
                  <p className="text-text-medium text-sm">你正在进入：{stats?.currentPhase}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-text-medium font-light">
                  你最近持续偏爱：
                </p>
                <div className="flex gap-2 flex-wrap">
                  {stats?.favoriteColors.map((color) => (
                    <span
                      key={color}
                      className="px-4 py-2 rounded-full text-sm font-light"
                      style={{ backgroundColor: todayThemeColor + '20', color: todayThemeColor }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <p className="text-sm text-text-medium font-light">
                  主导情绪：<span style={{ color: todayThemeColor }}>{stats?.topMood}</span>
                </p>
                <p className="text-sm text-text-medium font-light">
                  最常遇见：<span style={{ color: todayThemeColor }}>{stats?.topObject}</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              className="glass-effect rounded-3xl p-6 mb-6 soft-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-text-medium" />
                <h2 className="text-lg font-light text-text-dark">颜色曲线</h2>
              </div>
              
              <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className="w-full h-48"
              />
              
              <div className="flex justify-between text-xs text-text-medium mt-2">
                <span>第1张</span>
                <span>第{captures.length}张</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                className="glass-effect rounded-2xl p-4 soft-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-text-medium" />
                  <span className="text-sm text-text-medium">Walk次数</span>
                </div>
                <p className="text-2xl font-light" style={{ color: todayThemeColor }}>
                  {stats?.totalWalks}
                </p>
              </motion.div>

              <motion.div
                className="glass-effect rounded-2xl p-4 soft-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-text-medium" />
                  <span className="text-sm text-text-medium">收集颜色</span>
                </div>
                <p className="text-2xl font-light" style={{ color: todayThemeColor }}>
                  {stats?.totalCaptures}
                </p>
              </motion.div>
            </div>

            {dailyAnalysis && (
              <motion.div
                className="glass-effect rounded-2xl p-4 soft-shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-center text-text-medium font-light text-sm italic leading-relaxed">
                  "{dailyAnalysis.poeticSentence}"
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20">
        <div className="flex justify-around items-center py-6 max-w-md mx-auto">
          <button
            onClick={() => navigate('/map')}
            className="flex flex-col items-center gap-2 text-text-medium"
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
            className="flex flex-col items-center gap-2"
            style={{ color: todayThemeColor }}
          >
            <span className="text-xs font-light">我的情绪</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
