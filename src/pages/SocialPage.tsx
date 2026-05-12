import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Users } from 'lucide-react';

const SocialPage: React.FC = () => {
  const navigate = useNavigate();
  const { todayThemeColor, nearbyUsers } = useAppStore();

  const mockFeed = [
    {
      id: '1',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%234A90D9" width="400" height="300"/%3E%3C/svg%3E',
      colorName: '蓝色',
      poeticSentence: '今天的天空很蓝，像一块洗净的布。',
      location: '东区',
      timestamp: new Date(),
    },
    {
      id: '2',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23E57373" width="400" height="300"/%3E%3C/svg%3E',
      colorName: '红色',
      poeticSentence: '夕阳落在墙上，像一杯温热的红酒。',
      location: '西区',
      timestamp: new Date(),
    },
    {
      id: '3',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%2381C784" width="400" height="300"/%3E%3C/svg%3E',
      colorName: '绿色',
      poeticSentence: '树叶在风里摇晃，是夏天的形状。',
      location: '北区',
      timestamp: new Date(),
    },
  ];

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
          <h1 className="text-xl font-light text-text-dark">颜色流</h1>
        </div>

        <motion.div
          className="glass-effect rounded-2xl p-4 mb-6 soft-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: todayThemeColor + '20' }}
            >
              <Users size={24} style={{ color: todayThemeColor }} />
            </div>
            <div>
              <p className="text-text-dark font-light">
                附近有<span className="font-medium" style={{ color: todayThemeColor }}>{nearbyUsers}</span>个人正在寻找颜色
              </p>
              <p className="text-sm text-text-medium">大家都在寻找什么？</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {mockFeed.map((item, index) => (
            <motion.div
              key={item.id}
              className="glass-effect rounded-2xl overflow-hidden soft-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="aspect-video relative">
                <img
                  src={item.imageUrl}
                  alt={item.colorName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: todayThemeColor }}
                    />
                    <span className="text-white text-sm font-light">{item.colorName}</span>
                    <span className="text-white/60 text-xs">· {item.location}</span>
                  </div>
                  <p className="text-white/90 text-sm font-light italic leading-relaxed">
                    "{item.poeticSentence}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-text-medium text-sm font-light">
            这是一个安静的角落<br />
            没有关注，没有比较<br />
            只有颜色的相遇
          </p>
        </motion.div>
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
            className="flex flex-col items-center gap-2 text-text-medium"
          >
            <span className="text-xs font-light">我的情绪</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
