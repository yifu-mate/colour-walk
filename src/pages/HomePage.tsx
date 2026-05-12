import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Map, BookMarked, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { todayThemeColor, todayPrompt, startWalk } = useAppStore();

  const handleStartWalk = () => {
    startWalk();
    navigate('/walk');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <p className="text-text-medium text-base tracking-wide leading-relaxed max-w-xs">
            {todayPrompt}
          </p>
        </motion.div>

        <motion.div
          className="relative w-72 h-72 mb-16"
          style={{ backgroundColor: todayThemeColor }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            delay: 0.2,
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: todayThemeColor }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: todayThemeColor }}
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm"
              animate={{
                scale: [1, 0.95, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>

        <motion.button
          onClick={handleStartWalk}
          className="px-12 py-4 rounded-full text-white font-light tracking-widest text-sm glass-effect soft-shadow hover:scale-105 transition-transform"
          style={{
            backgroundColor: todayThemeColor,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          开始 Walk
        </motion.button>
      </div>

      <motion.div
        className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex justify-around items-center py-6 max-w-md mx-auto">
          <button
            onClick={() => navigate('/map')}
            className="flex flex-col items-center gap-2 text-text-medium hover:text-text-dark transition-colors"
          >
            <Map size={24} strokeWidth={1.5} />
            <span className="text-xs font-light">地图</span>
          </button>
          <button
            onClick={() => navigate('/collection')}
            className="flex flex-col items-center gap-2 text-text-medium hover:text-text-dark transition-colors"
          >
            <BookMarked size={24} strokeWidth={1.5} />
            <span className="text-xs font-light">收藏册</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-2 text-text-medium hover:text-text-dark transition-colors"
          >
            <Heart size={24} strokeWidth={1.5} />
            <span className="text-xs font-light">我的情绪</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
