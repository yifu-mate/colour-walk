export interface ColorSwatch {
  hex: string;
  name: string;
  nameEn: string;
  family: string;
  mood: string;
}

export interface ColorCapture {
  id: string;
  imageUrl: string;
  primaryColor: string;
  colorName: string;
  colorNameEn: string;
  colorFamily: string;
  objectType: string;
  moodTags: string[];
  capturedAt: Date;
}

export interface Collection {
  id: string;
  date: string;
  themeColor: string;
  captures: ColorCapture[];
  isComplete: boolean;
}

export interface DailyAnalysis {
  title: string;
  colorDistribution: Record<string, number>;
  moodSummary: string;
  poeticSentence: string;
}

export interface ColorEvent {
  id: string;
  name: string;
  emoji: string;
  themeColor: string;
  isActive: boolean;
  description: string;
}

export interface CityColorData {
  region: string;
  coordinates: [number, number];
  dominantColors: string[];
  captureCount: number;
}

export interface CommunityItem {
  id: string;
  imageUrl: string;
  colorName: string;
  poeticSentence: string;
  location?: string;
  timestamp: Date;
}
