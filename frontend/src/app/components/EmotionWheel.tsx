"use client";

import { useState, useMemo } from "react";
import { emotions, baseEmotions } from "../data/emotions";

interface EmotionWheelProps {
  selectedEmotions: string[];
  onEmotionSelect: (emotionId: string) => void;
  maxSelections?: number;
}

const getEmotionPosition = (
  emotion: any,
  index: number,
  totalInCategory: number,
) => {
  const base = baseEmotions.find((b) => b.id === emotion.baseEmotion);
  if (!base) return { x: 0, y: 0 };

  const radii = [150, 200, 250];
  const radius = radii[emotion.intensity];

  const angleStep = 30 / totalInCategory;
  const angle = base.angle - 15 + index * angleStep;

  const angleInRad = (angle * Math.PI) / 180;
  const x = radius * Math.cos(angleInRad);
  const y = radius * Math.sin(angleInRad);

  return { x, y, radius };
};

export default function EmotionWheel({
  selectedEmotions,
  onEmotionSelect,
  maxSelections = 5,
}: EmotionWheelProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);

  const emotionPositions = useMemo(() => {
    return emotions.map((emotion) => {
      const baseEmotionsInCategory = emotions.filter(
        (e) => e.baseEmotion === emotion.baseEmotion,
      );
      const emotionIndex = baseEmotionsInCategory.indexOf(emotion);
      return {
        emotion,
        position: getEmotionPosition(
          emotion,
          emotionIndex,
          baseEmotionsInCategory.length,
        ),
      };
    });
  }, []);

  const handleEmotionClick = (emotionId: string) => {
    if (
      selectedEmotions.includes(emotionId) ||
      selectedEmotions.length < maxSelections
    ) {
      onEmotionSelect(emotionId);
    }
  };

  const getEmotionSize = (intensity: number) => {
    const sizes = ["5rem", "5.5rem", "6rem"];
    return sizes[intensity];
  };

  const getFontSize = (intensity: number) => {
    return intensity === 0
      ? "text-[10px]"
      : intensity === 1
        ? "text-xs"
        : "text-sm";
  };

  const getTextColor = (intensity: number) => {
    return intensity === 0 ? "text-gray-800" : "text-white";
  };

  const emotionsByCategory = useMemo(() => {
    const grouped: { category: string; emotions: typeof emotions }[] = [];
    baseEmotions.forEach((base) => {
      const categoryEmotions = emotions.filter(
        (emotion) => emotion.baseEmotion === base.id,
      );
      grouped.push({
        category: base.name,
        emotions: categoryEmotions,
      });
    });
    return grouped;
  }, []);

  const MobileEmotionList = () => (
    <div className="w-full lg:hidden space-y-6">
      {emotionsByCategory.map(({ category, emotions: categoryEmotions }) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {categoryEmotions.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion.id);
              const canSelect =
                selectedEmotions.length < maxSelections || isSelected;

              return (
                <button
                  key={emotion.id}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 ease-out
                    ${
                      isSelected
                        ? "ring-2 ring-white ring-opacity-80 border-white scale-[1.02]"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#7F1D1D] dark:hover:border-[#f87171]"
                    }
                    ${
                      !canSelect && !isSelected
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    }
                  `}
                  style={{
                    backgroundColor: emotion.color,
                  }}
                  onClick={() => canSelect && handleEmotionClick(emotion.id)}
                  disabled={!canSelect && !isSelected}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: emotion.color }}
                    />
                    <div className="flex-1">
                      <span
                        className={`text-base font-semibold ${
                          emotion.intensity === 0
                            ? "text-gray-800"
                            : "text-white"
                        }`}
                      >
                        {emotion.name}
                      </span>
                      <p
                        className={`text-xs mt-1 ${
                          emotion.intensity === 0
                            ? "text-gray-600"
                            : "text-white text-opacity-90"
                        }`}
                      >
                        {emotion.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const DesktopEmotionWheel = () => (
    <div className="hidden lg:flex items-center justify-center">
      <div className="relative w-[40rem] h-[40rem]">
        <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
        <div className="absolute inset-12 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
        <div className="absolute inset-24 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>

        {emotionPositions.map(({ emotion, position }) => {
          const isSelected = selectedEmotions.includes(emotion.id);
          const canSelect =
            selectedEmotions.length < maxSelections || isSelected;
          const isHovered = hoveredEmotion === emotion.id;
          const shouldScale = isHovered && canSelect;

          return (
            <button
              key={emotion.id}
              className={`
                absolute rounded-full flex flex-col items-center justify-center font-medium 
                text-center leading-tight px-1 py-0.5 will-change-transform
                ${getFontSize(emotion.intensity)}
                ${isSelected ? "ring-2 ring-white ring-opacity-80 z-20" : ""}
                ${!canSelect && !isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                backgroundColor: emotion.color,
                width: getEmotionSize(emotion.intensity),
                height: getEmotionSize(emotion.intensity),
                border: isSelected ? "2px solid white" : "none",
                transform: `translate(-50%, -50%) scale(${shouldScale ? 1.12 : 1})`,
                transition: `transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.2s ease`,
                boxShadow: shouldScale
                  ? "0 10px 25px -5px rgba(0,0,0,0.3)"
                  : "none",
                zIndex: shouldScale ? 30 : 10,
              }}
              onClick={() => canSelect && handleEmotionClick(emotion.id)}
              title={`${emotion.name} - ${emotion.description}`}
              disabled={!canSelect && !isSelected}
              onMouseEnter={() => canSelect && setHoveredEmotion(emotion.id)}
              onMouseLeave={() => setHoveredEmotion(null)}
            >
              <span
                className={`font-semibold whitespace-normal break-words hyphens-auto ${getTextColor(emotion.intensity)}`}
                style={{
                  textShadow:
                    emotion.intensity > 0
                      ? "0 1px 2px rgba(0,0,0,0.3)"
                      : "none",
                }}
              >
                {emotion.name}
              </span>
            </button>
          );
        })}

        <div className="absolute inset-0 m-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-xl border-2 border-white transition-all duration-300 hover:scale-105 cursor-pointer">
          <span className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium px-2">
            Ваше настроение
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <MobileEmotionList />
      <DesktopEmotionWheel />
    </div>
  );
}
