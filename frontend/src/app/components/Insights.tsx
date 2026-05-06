"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Brain } from "lucide-react";

interface InsightsProps {
  userId: number;
}

export default function Insights({ userId }: InsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/analytics/insights`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      const cleanedInsights = data.insights.map((insight: string) => {
        const withoutEmoji = insight.replace(/[📉🌟✨🎉💪📝🔥]/g, "").trim();
        return `Такса заметила, что ${withoutEmoji.charAt(0).toLowerCase() + withoutEmoji.slice(1)}`;
      });
      setInsights(cleanedInsights);
    } catch (error) {
      console.error("Ошибка загрузки инсайтов:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F1D1D]"></div>
      </div>
    );
  }

  if (
    insights.length === 0 ||
    (insights.length === 1 && insights[0].includes("недостаточно данных"))
  ) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="w-64 h-64">
          <Image
            src="/dogDown.png"
            alt="Такса"
            width={256}
            height={256}
            className="object-contain"
            style={{ transform: "scaleX(-1)" }}
            priority
          />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 text-center max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
          <Brain className="w-8 h-8 text-[#7F1D1D] dark:text-[#f87171] mx-auto mb-2" />
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Пока недостаточно данных для анализа. Добавьте больше записей, и
            такса расскажет интересные закономерности!
          </p>
        </div>
      </div>
    );
  }

  const currentInsightText = insights[currentInsight];

  return (
    <div className="w-full">
      {/* Десктоп: Такса слева, облако справа, хвостик влево */}
      <div className="hidden md:flex md:justify-center md:gap-2">
        {/* Такса */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image
              src="/dogDown.png"
              alt="Такса"
              width={384}
              height={384}
              className="object-contain"
              style={{ transform: "scaleX(-1)" }}
              priority
            />
          </div>
        </div>

        {/* Облако с хвостиком влево */}
        <div className="relative flex-1 max-w-md">
          {/* Хвостик облака — указывает на таксу */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-[#7F1D1D] dark:text-[#f87171]" />
              <h3 className="font-bold text-[#7F1D1D] dark:text-[#f87171] text-sm tracking-wide">
                СОВЕТ ОТ ТАКСЫ
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
              {currentInsightText}
            </p>
          </div>
        </div>
      </div>

      {/* Мобильная версия: сначала облако, потом такса, хвостик снизу */}
      <div className="flex flex-col items-center gap-4 md:hidden">
        {/* Облако с хвостиком снизу */}
        <div className="relative w-full max-w-sm">
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white dark:border-t-gray-800 z-10"></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-[#7F1D1D] dark:text-[#f87171]" />
              <h3 className="font-bold text-[#7F1D1D] dark:text-[#f87171] text-xs tracking-wide">
                СОВЕТ ОТ ТАКСЫ
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
              {currentInsightText}
            </p>
          </div>
        </div>

        {/* Такса */}
        <div className="flex-shrink-0">
          <div className="relative w-72 h-72">
            <Image
              src="/dogDown.png"
              alt="Такса"
              width={288}
              height={288}
              className="object-contain"
              style={{ transform: "scaleX(-1)" }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
