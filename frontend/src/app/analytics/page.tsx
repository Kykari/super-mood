"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

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

// Цветовая палитра в вашей гамме
const COLOR_PALETTE = [
  "#7F1D1D",
  "#991B1B",
  "#B91C1C",
  "#DC2626",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "moods" | "activities" | "timeline"
  >("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [activitiesRes, analyticsRes] = await Promise.all([
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
          }/activities`,
          { credentials: "include" }
        ),
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
          }/analytics`,
          { credentials: "include" }
        ),
      ]);

      if (!analyticsRes.ok) throw new Error();

      const [actsData, analyticsData] = await Promise.all([
        activitiesRes.json(),
        analyticsRes.json(),
      ]);

      setActivities(actsData);
      setAnalyticsData(analyticsData);
    } catch (err) {
      toast.error("Ошибка загрузки аналитики");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };  

  const activityMap = Object.fromEntries(activities.map((a) => [a.id, a.name]));

  // Подготовка данных для графиков
  const prepareMoodDistributionData = () => {
    if (!analyticsData?.mood_distribution) return [];

    return Object.entries(analyticsData.mood_distribution)
      .map(([mood, count]) => ({
        name: moodTranslations[mood] || mood,
        value: count,
        color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
      }))
      .sort((a, b) => b.value - a.value);
  };

  const prepareActivityDistributionData = () => {
    if (!analyticsData?.activity_distribution) return [];

    return Object.entries(analyticsData.activity_distribution)
      .map(([activityId, count]) => ({
        name: activityMap[parseInt(activityId)] || `Активность ${activityId}`,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Топ 10 активностей
  };

  const prepareMoodTimelineData = () => {
    if (!analyticsData?.moods_over_time) return [];

    const entries = Object.entries(analyticsData.moods_over_time);
    if (entries.length === 0) return [];

    // Берем последние 14 дней или все если меньше
    const sortedDates = entries
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateA).getTime() - new Date(dateB).getTime()
      )
      .slice(-14);

    return sortedDates.map(([date, moods]) => {
      const dateObj = new Date(date);
      const moodEntries = Object.entries(moods);
      const totalMoodCount = moodEntries.reduce(
        (sum, [, count]) => sum + count,
        0
      );
      const avgMoodScore =
        moodEntries.reduce((sum, [mood, count]) => {
          // Простая оценка настроения от 1 до 10
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
  };

  const prepareWeekdayData = () => {
    if (!analyticsData?.moods_by_weekday) return [];

    const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    return Object.entries(analyticsData.moods_by_weekday).map(
      ([weekday, moods]) => {
        const moodCount = Object.values(moods).reduce(
          (sum, count) => sum + count,
          0
        );
        return {
          day: weekdays[parseInt(weekday)],
          moodCount,
          moods: Object.entries(moods).map(([mood, count]) => ({
            name: moodTranslations[mood] || mood,
            value: count,
          })),
        };
      }
    );
  };

  const prepareHourlyData = () => {
    if (!analyticsData?.moods_by_hour) return [];

    return Object.entries(analyticsData.moods_by_hour).map(([hour, count]) => ({
      hour: `${hour}:00`,
      value: count,
    }));
  };

  // Компоненты графиков
  const MoodDistributionChart = () => {
    const data = prepareMoodDistributionData();
    if (data.length === 0)
      return (
        <div className="text-gray-500 dark:text-gray-400">
          Нет данных о настроениях
        </div>
      );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} записей`, "Количество"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const ActivityDistributionChart = () => {
    const data = prepareActivityDistributionData();
    if (data.length === 0)
      return (
        <div className="text-gray-500 dark:text-gray-400">
          Нет данных об активностях
        </div>
      );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} раз`, "Количество"]} />
          <Legend />
          <Bar dataKey="value" name="Количество" fill="#7F1D1D" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const MoodTimelineChart = () => {
    const data = prepareMoodTimelineData();
    if (data.length === 0)
      return (
        <div className="text-gray-500 dark:text-gray-400">
          Нет данных за период
        </div>
      );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip
            formatter={(value) => [`${value}`, "Настроение (1-10)"]}
            labelFormatter={(label) => `Дата: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="moodScore"
            name="Уровень настроения"
            stroke="#DC2626"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="moodCount"
            name="Количество записей"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const WeekdayRadarChart = () => {
    const data = prepareWeekdayData();
    if (data.length === 0)
      return (
        <div className="text-gray-500 dark:text-gray-400">
          Нет данных по дням недели
        </div>
      );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="day" stroke="#9CA3AF" />
          <PolarRadiusAxis stroke="#9CA3AF" />
          <Radar
            name="Активность настроений"
            dataKey="moodCount"
            stroke="#DC2626"
            fill="#DC2626"
            fillOpacity={0.6}
          />
          <Legend />
          <Tooltip
            formatter={(value) => [`${value} настроений`, "Количество"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const HourlyBarChart = () => {
    const data = prepareHourlyData();
    if (data.length === 0)
      return (
        <div className="text-gray-500 dark:text-gray-400">
          Нет данных по времени суток
        </div>
      );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} записей`, "Количество"]} />
          <Legend />
          <Bar dataKey="value" name="Записи по часам" fill="#991B1B" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Статистические карточки
  const StatCard = ({
    title,
    value,
    icon,
    color = "#7F1D1D",
    subtitle = "",
  }: {
    title: string;
    value: string | number;
    icon: string;
    color?: string;
    subtitle?: string;
  }) => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
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
        <span className="text-2xl">{icon}</span>
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
        <div className="container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">📊</div>
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
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Заголовок */}
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

        {/* Табы навигации */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {(
            [
              { id: "overview", label: "Обзор", icon: "📈" },
              { id: "moods", label: "Настроения", icon: "💭" },
              { id: "activities", label: "Активности", icon: "⚡" },
              { id: "timeline", label: "Временная шкала", icon: "⏱️" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Всего записей"
            value={analyticsData.summary.total_entries}
            icon="📊"
            subtitle={`За ${analyticsData.summary.days_active} дней`}
          />
          <StatCard
            title="Самое частое настроение"
            value={topMood}
            icon="💫"
            color="#DC2626"
          />
          <StatCard
            title="Популярная активность"
            value={topActivity}
            icon="⚡"
            color="#991B1B"
          />
          <StatCard
            title="Ведем с"
            value={new Date(
              analyticsData.summary.first_entry
            ).toLocaleDateString("ru-RU")}
            icon="📅"
            color="#B91C1C"
          />
        </div>

        {/* Контент вкладок */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>📊</span>
                Распределение настроений
              </h3>
              <MoodDistributionChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span>⏱️</span>
                  Активность по дням недели
                </h3>
                <WeekdayRadarChart />
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span>🕒</span>
                  Записи по времени суток
                </h3>
                <HourlyBarChart />
              </div>
            </div>
          </div>
        )}

        {activeTab === "moods" && (
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Детальный анализ настроений
              </h3>
              <MoodDistributionChart />
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Динамика настроения
              </h3>
              <MoodTimelineChart />
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Распределение активностей
              </h3>
              <ActivityDistributionChart />
            </div>

            {prepareActivityDistributionData().length > 0 && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Топ активностей
                </h3>
                <div className="space-y-3">
                  {prepareActivityDistributionData().map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            backgroundColor:
                              COLOR_PALETTE[index % COLOR_PALETTE.length],
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {activity.name}
                        </span>
                      </div>
                      <span className="font-bold text-[#7F1D1D] dark:text-[#f87171]">
                        {activity.value} раз
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Динамика настроения по времени
              </h3>
              <MoodTimelineChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  По дням недели
                </h3>
                <WeekdayRadarChart />
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  По часам дня
                </h3>
                <HourlyBarChart />
              </div>
            </div>
          </div>
        )}

        {/* Кнопка действий */}
        <div className="mt-12 text-center">
          <Link href="/stories">
            <button className="px-8 py-3 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow mr-4">
              📋 К истории записей
            </button>
          </Link>
          <Link href="/stories/create">
            <button className="px-8 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              ➕ Добавить запись
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
