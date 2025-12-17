export interface Emotion {
  id: string;
  name: string;
  color: string;
  intensity: number; 
  baseEmotion: string;
  description?: string;
}

export interface EmotionWheelProps {
  selectedEmotions: string[];
  onEmotionSelect: (emotionId: string) => void;
  maxSelections?: number;
}

export interface BaseEmotion {
  id: string;
  name: string;
  color: string;
  angle: number;
}

export interface Activity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface MoodEntry {
  id?: string;
  emotions: string[];
  activities: string[];
  description: string;
  photos: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
