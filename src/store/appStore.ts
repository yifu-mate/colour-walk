import { create } from 'zustand';
import { Collection, ColorCapture, DailyAnalysis, ColorEvent, CommunityItem } from '../types';

interface AppState {
  todayThemeColor: string;
  todayPrompt: string;
  currentCollection: Collection | null;
  isWalkMode: boolean;
  walkProgress: number;
  dailyAnalysis: DailyAnalysis | null;
  activeEvent: ColorEvent | null;
  nearbyUsers: number;
  communityFeed: CommunityItem[];
  
  setThemeColor: (color: string) => void;
  setPrompt: (prompt: string) => void;
  startWalk: () => void;
  endWalk: () => void;
  addCapture: (capture: ColorCapture) => void;
  updateProgress: (progress: number) => void;
  completeWalk: () => void;
  setAnalysis: (analysis: DailyAnalysis) => void;
  setActiveEvent: (event: ColorEvent | null) => void;
  setNearbyUsers: (count: number) => void;
  addToFeed: (item: CommunityItem) => void;
}

const DAILY_PROMPTS = [
  "今天，要不要去寻找一点蓝色？",
  "今天的天空是什么颜色？",
  "有没有注意到街角的那抹红？",
  "今天的你，想寻找什么颜色？",
  "闭上眼睛，想象一个颜色，然后去找它。",
];

const THEME_COLORS = [
  '#4A90D9', // 蓝色
  '#E57373', // 红色
  '#81C784', // 绿色
  '#FFD54F', // 黄色
  '#BA68C8', // 紫色
  '#FF8A65', // 橙色
  '#4DB6AC', // 青色
  '#F06292', // 粉色
];

export const useAppStore = create<AppState>((set, get) => ({
  todayThemeColor: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
  todayPrompt: DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)],
  currentCollection: null,
  isWalkMode: false,
  walkProgress: 0,
  dailyAnalysis: null,
  activeEvent: null,
  nearbyUsers: Math.floor(Math.random() * 50) + 10,
  communityFeed: [],

  setThemeColor: (color) => set({ todayThemeColor: color }),
  setPrompt: (prompt) => set({ todayPrompt: prompt }),

  startWalk: () => {
    const today = new Date().toISOString().split('T')[0];
    set({
      isWalkMode: true,
      walkProgress: 0,
      currentCollection: {
        id: `collection-${today}`,
        date: today,
        themeColor: get().todayThemeColor,
        captures: [],
        isComplete: false,
      },
    });
  },

  endWalk: () => {
    set({
      isWalkMode: false,
    });
  },

  addCapture: (capture) => {
    const { currentCollection } = get();
    if (currentCollection) {
      set({
        currentCollection: {
          ...currentCollection,
          captures: [...currentCollection.captures, capture],
        },
      });
    }
  },

  updateProgress: (progress) => set({ walkProgress: progress }),

  completeWalk: () => {
    const { currentCollection } = get();
    if (currentCollection) {
      set({
        currentCollection: {
          ...currentCollection,
          isComplete: true,
        },
        isWalkMode: false,
      });
    }
  },

  setAnalysis: (analysis) => set({ dailyAnalysis: analysis }),

  setActiveEvent: (event) => set({ activeEvent: event }),

  setNearbyUsers: (count) => set({ nearbyUsers: count }),

  addToFeed: (item) => {
    set((state) => ({
      communityFeed: [item, ...state.communityFeed],
    }));
  },
}));
