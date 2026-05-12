import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Sparkles } from 'lucide-react';

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    todayThemeColor, 
    currentCollection, 
    dailyAnalysis, 
    setAnalysis 
  } = useAppStore();

  useEffect(() => {
    if (currentCollection && currentCollection.isComplete && !dailyAnalysis) {
      generateAnalysis();
    }
  }, [currentCollection]);

  const generateAnalysis = () => {
    const captures = currentCollection?.captures || [];
    const colorCounts: Record<string, number> = {};
    const objectCounts: Record<string, number> = {};
    
    captures.forEach(capture => {
      colorCounts[capture.colorName] = (colorCounts[capture.colorName] || 0) + 1;
      objectCounts[capture.objectType] = (objectCounts[capture.objectType] || 0) + 1;
    });

    const total = captures.length;
    const colorDistribution: Record<string, number> = {};
    
    Object.entries(colorCounts).forEach(([color, count]) => {
      colorDistribution[color] = Math.round((count / total) * 100);
    });

    const mostCommonObject = Object.entries(objectCounts)
      .sort(([, a], [, b]) => b - a)[0];

    const poeticSentences = [
      '你今天经过很多冷色，但最后停在了一杯热咖啡前。',
      '这座城市的蓝色比你想象的要多。',
      '你似乎在寻找：安静感。',
      '今天的颜色讲述了一个关于散步的故事。',
      '每一个颜色都是一个小小的发现。',
    ];

    setAnalysis({
      title: `你的今日${todayThemeColor === '#4A90D9' ? '蓝色' : '色彩'}`,
      colorDistribution,
      moodSummary: `你今天遇见了${total}种颜色，主要在寻找：${mostCommonObject[0]}`,
      poeticSentence: poeticSentences[Math.floor(Math.random() * poeticSentences.length)],
    });
  };

  const captures = currentCollection?.captures || [];
  const hasCaptures = captures.length > 0;
  const isComplete = currentCollection?.isComplete || false;

  const handleDownloadPoster = () => {
    if (!currentCollection || captures.length === 0) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = todayThemeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Noto Sans SC';
    ctx.textAlign = 'center';
    ctx.fillText(dailyAnalysis?.title || '你的今日色彩', canvas.width / 2, 100);

    ctx.font = '24px Noto Sans SC';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(dailyAnalysis?.poeticSentence || '', canvas.width / 2, 150, 700);

    const gridSize = 3;
    const cellWidth = 200;
    const cellHeight = 150;
    const startX = (canvas.width - cellWidth * gridSize) / 2;
    const startY = 200;

    captures.slice(0, 9).forEach((capture, index) => {
      const col = index % gridSize;
      const row = Math.floor(index / gridSize);
      const x = startX + col * cellWidth;
      const y = startY + row * cellHeight;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, x + 5, y + 5, cellWidth - 10, cellHeight - 10);
      };
      img.src = capture.imageUrl;
    });

    const link = document.createElement('a');
    link.download = `colour-walk-${currentCollection.date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyToClipboard = async () => {
    if (!currentCollection || captures.length === 0) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 600;

      ctx.fillStyle = todayThemeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Noto Sans SC';
      ctx.textAlign = 'center';
      ctx.fillText(dailyAnalysis?.title || '你的今日色彩', canvas.width / 2, 100);

      ctx.font = '24px Noto Sans SC';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText(dailyAnalysis?.poeticSentence || '', canvas.width / 2, 150, 700);

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('海报已复制到剪贴板！');
        }
      });
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请尝试下载');
    }
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
          <h1 className="text-xl font-light text-text-dark">收藏册</h1>
        </div>

        {!isComplete ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-48 h-48 rounded-full mb-8"
              style={{ backgroundColor: todayThemeColor + '20' }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <Sparkles size={48} className="text-text-medium" strokeWidth={1} />
              </div>
            </motion.div>
            <p className="text-text-medium text-center font-light leading-relaxed max-w-xs">
              完成今天的Walk后，<br />
              你的颜色收藏将会出现在这里
            </p>
          </motion.div>
        ) : (
          <div>
            {hasCaptures && dailyAnalysis && (
              <motion.div
                className="glass-effect rounded-3xl p-8 mb-6 soft-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-light text-text-dark mb-2">
                    {dailyAnalysis.title}
                  </h2>
                  <p className="text-text-medium font-light italic leading-relaxed">
                    "{dailyAnalysis.poeticSentence}"
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {Object.entries(dailyAnalysis.colorDistribution).map(([color, percentage]) => (
                    <div key={color} className="flex items-center gap-3">
                      <span className="text-sm text-text-medium w-12">{color}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: todayThemeColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-sm text-text-medium w-10 text-right">{percentage}%</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-text-medium font-light">
                    {dailyAnalysis.moodSummary}
                  </p>
                </div>
              </motion.div>
            )}

            {hasCaptures && (
              <div className="mb-6">
                <h3 className="text-lg font-light text-text-dark mb-4">今日色卡</h3>
                <div className="space-y-4">
                  {captures.map((capture, index) => (
                    <motion.div
                      key={capture.id}
                      className="glass-effect rounded-2xl overflow-hidden soft-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <div className="flex">
                        <div
                          className="w-28 flex-shrink-0"
                          style={{ backgroundColor: capture.primaryColor }}
                        >
                          <img
                            src={capture.imageUrl}
                            alt={capture.colorName}
                            className="w-full h-full object-cover mix-blend-multiply opacity-60"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-5 h-5 rounded-lg"
                              style={{ backgroundColor: capture.primaryColor }}
                            />
                            <span className="text-text-dark font-light text-lg">{capture.colorName}</span>
                          </div>
                          <p className="text-text-medium text-xs mb-2">{capture.colorNameEn}</p>
                          <div className="flex items-center gap-3 text-xs text-text-medium">
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
              </div>
            )}

            {hasCaptures && dailyAnalysis && (
              <motion.div
                className="glass-effect rounded-3xl p-6 soft-shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-dark font-light mb-1">AI色彩海报</p>
                    <p className="text-sm text-text-medium">已生成</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDownloadPoster}
                      className="px-4 py-2 rounded-full text-white text-sm font-light soft-shadow"
                      style={{ backgroundColor: todayThemeColor }}
                    >
                      <span>下载</span>
                    </button>
                    <button 
                      onClick={handleCopyToClipboard}
                      className="px-4 py-2 rounded-full text-white text-sm font-light soft-shadow"
                      style={{ backgroundColor: todayThemeColor + 'CC' }}
                    >
                      <span>复制</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
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
            className="flex flex-col items-center gap-2"
            style={{ color: todayThemeColor }}
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

export default CollectionPage;
