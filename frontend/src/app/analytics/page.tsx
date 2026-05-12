"use client";

import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import BackToHome from "../components/BackToHome";
import {
  BarChart3,
  Brain,
  Activity,
  BookOpen,
  Plus,
  TrendingUp,
  Sparkles,
  Calendar,
} from "lucide-react";

// Ленивая загрузка графиков для уменьшения initial bundle
import dynamic from "next/dynamic";

const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false },
);
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), {
  ssr: false,
});
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), {
  ssr: false,
});
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), {
  ssr: false,
});
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), {
  ssr: false,
});
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false },
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);
const RadarChart = dynamic(
  () => import("recharts").then((mod) => mod.RadarChart),
  { ssr: false },
);
const Radar = dynamic(() => import("recharts").then((mod) => mod.Radar), {
  ssr: false,
});
const PolarGrid = dynamic(
  () => import("recharts").then((mod) => mod.PolarGrid),
  { ssr: false },
);
const PolarAngleAxis = dynamic(
  () => import("recharts").then((mod) => mod.PolarAngleAxis),
  { ssr: false },
);
const PolarRadiusAxis = dynamic(
  () => import("recharts").then((mod) => mod.PolarRadiusAxis),
  { ssr: false },
);

interface AnalyticsData {
  summary: {
    total_entries: number;
    days_active: number;
    first_entry: string;
    top_mood: string;
    top_activity_id: number;
  };
  moods_over_time: Record<string, Record<string, number>>;
  mood_distribution: Record<string, number>;
  moods_by_weekday: Record<number, Record<string, number>>;
  moods_by_hour: Record<number, number>;
  activity_distribution: Record<number, number>;
  updated_at: string;
  message?: string;
}

interface Activity {
  id: number;
  name: string;
}

// Маппинг эмоций на русский
const moodTranslations: Record<string, string> = {
  joy: "радость",
  trust: "доверие",
  fear: "страх",
  surprise: "удивление",
  sadness: "грусть",
  disgust: "отвращение",
  anger: "гнев",
  anticipation: "ожидание",
  ecstasy: "экстаз",
  admiration: "восхищение",
  terror: "ужас",
  amazement: "изумление",
  grief: "горе",
  loathing: "отвращение_глубокое",
  rage: "ярость",
  vigilance: "бдительность",
  love: "любовь",
  optimism: "оптимизм",
  submission: "покорность",
  awe: "благоговение",
  disapproval: "неодобрение",
  remorse: "раскаяние",
  contempt: "презрение",
  aggressiveness: "агрессивность",
  serenity: "спокойствие",
  acceptance: "принятие",
  apprehension: "тревога",
  distraction: "рассеянность",
  pensiveness: "задумчивость",
  boredom: "скука",
  annoyance: "раздражение",
  interest: "интерес",
};

// Цветовая палитра — более насыщенные и разнообразные цвета
const COLOR_PALETTE = [
  "#7F1D1D",
  "#DC2626",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#D946EF",
  "#EC4899",
];

// Компонент-обёртка для ленивой загрузки графиков
const ChartWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        Загрузка графика...
      </div>
    }
  >
    {children}
  </Suspense>
);

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "activities">(
    "overview",
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const [activitiesRes, analyticsRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/activities`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/analytics`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        ),
      ]);

      clearTimeout(timeoutId);

      if (!analyticsRes.ok) throw new Error("Ошибка загрузки аналитики");

      const [actsData, analyticsData] = await Promise.all([
        activitiesRes.json(),
        analyticsRes.json(),
      ]);

      setActivities(actsData);
      setAnalyticsData(analyticsData);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        toast.error("Превышено время ожидания");
      } else {
        toast.error("Ошибка загрузки аналитики");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activityMap = useMemo(
    () => Object.fromEntries(activities.map((a) => [a.id, a.name])),
    [activities],
  );

  const moodDistributionData = useMemo(() => {
    if (!analyticsData?.mood_distribution) return [];
    return Object.entries(analyticsData.mood_distribution)
      .map(([mood, count]) => ({
        name: moodTranslations[mood] || mood,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [analyticsData?.mood_distribution]);

  const activityDistributionData = useMemo(() => {
    if (!analyticsData?.activity_distribution) return [];
    return Object.entries(analyticsData.activity_distribution)
      .map(([activityId, count]) => ({
        name: activityMap[parseInt(activityId)] || `Активность ${activityId}`,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [analyticsData?.activity_distribution, activityMap]);

  const moodTimelineData = useMemo(() => {
    if (!analyticsData?.moods_over_time) return [];
    const entries = Object.entries(analyticsData.moods_over_time);
    if (entries.length === 0) return [];

    const sortedDates = entries
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateA).getTime() - new Date(dateB).getTime(),
      )
      .slice(-14);

    return sortedDates.map(([date, moods]) => {
      const dateObj = new Date(date);
      const moodEntries = Object.entries(moods);
      const totalMoodCount = moodEntries.reduce(
        (sum, [, count]) => sum + count,
        0,
      );
      const avgMoodScore =
        moodEntries.reduce((sum, [mood, count]) => {
          const moodScore =
            (Object.keys(moodTranslations).indexOf(mood) % 10) + 1;
          return sum + moodScore * count;
        }, 0) / totalMoodCount;

      return {
        date: dateObj.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        }),
        fullDate: date,
        moodScore: parseFloat(avgMoodScore.toFixed(2)),
        moodCount: totalMoodCount,
      };
    });
  }, [analyticsData?.moods_over_time]);

  const weekdayData = useMemo(() => {
    if (!analyticsData?.moods_by_weekday) return [];
    const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    return Object.entries(analyticsData.moods_by_weekday).map(
      ([weekday, moods]) => ({
        day: weekdays[parseInt(weekday)],
        moodCount: Object.values(moods).reduce((sum, count) => sum + count, 0),
      }),
    );
  }, [analyticsData?.moods_by_weekday]);

  const hourlyData = useMemo(() => {
    if (!analyticsData?.moods_by_hour) return [];
    return Object.entries(analyticsData.moods_by_hour).map(([hour, count]) => ({
      hour: `${hour}:00`,
      value: count,
    }));
  }, [analyticsData?.moods_by_hour]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "#7F1D1D",
    subtitle = "",
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: string;
    subtitle?: string;
  }) => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold" style={{ color }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F1D1D]"></div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.summary.total_entries === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-8">
          <BackToHome />
          <div className="max-w-4xl mx-auto text-center">
            <BarChart3 className="w-20 h-20 mx-auto mb-6 text-gray-400 dark:text-gray-500" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              АНАЛИТИКА НАСТРОЕНИЯ
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {analyticsData?.message ||
                "Начните вести записи, чтобы увидеть аналитику вашего настроения"}
            </p>
            <Link href="/stories/create">
              <button className="px-8 py-3 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow">
                Создать первую запись
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const topMood = analyticsData.summary.top_mood
    ? moodTranslations[analyticsData.summary.top_mood] ||
      analyticsData.summary.top_mood
    : "Нет данных";

  const topActivity = analyticsData.summary.top_activity_id
    ? activityMap[analyticsData.summary.top_activity_id] ||
      `Активность ${analyticsData.summary.top_activity_id}`
    : "Нет данных";

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <BackToHome />
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              АНАЛИТИКА НАСТРОЕНИЯ
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Глубокий анализ вашего эмоционального состояния на основе{" "}
            {analyticsData.summary.total_entries} записей
          </p>
        </div>

        {/* Табы навигации - только Обзор и Активности */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: "overview" as const, label: "Обзор", icon: TrendingUp },
            { id: "activities" as const, label: "Активности", icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Всего записей"
            value={analyticsData.summary.total_entries}
            icon={BarChart3}
            subtitle={`За ${analyticsData.summary.days_active} дней`}
          />
          <StatCard
            title="Самое частое настроение"
            value={topMood}
            icon={Sparkles}
            color="#DC2626"
          />
          <StatCard
            title="Популярная активность"
            value={topActivity}
            icon={Activity}
            color="#991B1B"
          />
          <StatCard
            title="Ведем с"
            value={new Date(
              analyticsData.summary.first_entry,
            ).toLocaleDateString("ru-RU")}
            icon={Calendar}
            color="#B91C1C"
          />
        </div>

        {/* Контент вкладок */}
        <div className="space-y-8">
          {/* Вкладка Обзор - распределение настроений + динамика + дни недели + часы */}
          {activeTab === "overview" && (
            <>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Распределение настроений
                </h3>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <defs>
                        {COLOR_PALETTE.map((color, index) => (
                          <linearGradient
                            key={`grad-${index}`}
                            id={`pieGrad-${index}`}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="0%" stopColor={color} />
                            <stop
                              offset="100%"
                              stopColor={color}
                              stopOpacity={0.7}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={moodDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        dataKey="value"
                      >
                        {moodDistributionData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#pieGrad-${index % COLOR_PALETTE.length})`}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value} записей`,
                          "Количество",
                        ]}
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Динамика настроения
                </h3>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={moodTimelineData}>
                      <defs>
                        <linearGradient
                          id="areaGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#DC2626"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#DC2626"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis domain={[0, 10]} stroke="#9CA3AF" />
                      <Tooltip
                        formatter={(value) => [`${value}`, "Настроение (1-10)"]}
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="moodScore"
                        stroke="#DC2626"
                        strokeWidth={3}
                        fill="url(#areaGradient)"
                        dot={{ r: 4, fill: "#DC2626", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Активность по дням недели
                  </h3>
                  <ChartWrapper>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={weekdayData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="day" stroke="#9CA3AF" />
                        <PolarRadiusAxis stroke="#9CA3AF" />
                        <Radar
                          name="Активность"
                          dataKey="moodCount"
                          stroke="#DC2626"
                          fill="#DC2626"
                          fillOpacity={0.6}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartWrapper>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Записи по времени суток
                  </h3>
                  <ChartWrapper>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          formatter={(value) => [
                            `${value} записей`,
                            "Количество",
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="value"
                          name="Записи по часам"
                          fill="#991B1B"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartWrapper>
                </div>
              </div>
            </>
          )}

          {/* Вкладка Активности */}
          {activeTab === "activities" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Распределение активностей
              </h3>
              <ChartWrapper>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      stroke="#9CA3AF"
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      formatter={(value) => [`${value} раз`, "Количество"]}
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Количество"
                      fill="#DC2626"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="mt-12 text-center">
          <Link href="/stories">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow mr-4">
              <BookOpen className="w-5 h-5" />К истории записей
            </button>
          </Link>
          <Link href="/stories/create">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <Plus className="w-5 h-5" />
              Добавить запись
            </button>
          </Link>
        </div>

        {/* Информация об обновлении */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Данные обновлены:{" "}
          {new Date(analyticsData.updated_at).toLocaleString("ru-RU")}
        </div>
      </div>
    </main>
  );
}
