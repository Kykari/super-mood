"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
}

interface MoodStory {
  id: number;
  moods: string[];
  text: string | null;
  created_at: string;
  photo_urls: string | null;
}

interface AnalyticsData {
  summary: {
    total_entries: number;
    top_mood: string;
    days_active: number;
  };
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

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestStory, setLatestStory] = useState<MoodStory | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/profile`,
        {
          credentials: "include",
          cache: "no-store", // важно для актуальности сессии
        }
      );

      if (!userRes.ok) {
        // Если не авторизован — редиректим на логин, без бросания ошибки
        router.push("/auth/login");
        return;
      }

      const userData = await userRes.json();
      setUser(userData);

      // Загружаем остальные данные только если пользователь авторизован
      const [storiesRes, analyticsRes] = await Promise.all([
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
          }/stories?limit=1`,
          {
            credentials: "include",
          }
        ),
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
          }/analytics`,
          {
            credentials: "include",
          }
        ),
      ]);

      if (storiesRes.ok) {
        const stories = await storiesRes.json();
        if (stories.length > 0) {
          setLatestStory(stories[0]);
        }
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      // Опционально: можно показать тост
      toast.error("Не удалось загрузить данные. Попробуйте перезайти.");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      });
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNormalizedPhotoUrls = (story: MoodStory | null): string[] => {
    if (!story?.photo_urls) return [];

    if (typeof story.photo_urls === "string") {
      try {
        const parsed = JSON.parse(story.photo_urls);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [story.photo_urls];
      }
    }
    return story.photo_urls;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Доброй ночи";
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F1D1D]"></div>
      </div>
    );
  }

  const username = user?.username || "Друг";

  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-16 sm:pt-20">
        <section className="mb-10 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8 lg:gap-10">
            <div className="order-1 lg:order-1 lg:w-2/5">
              <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full">
                <Image
                  src="/dogAsk.png"
                  alt="Такса"
                  width={400}
                  height={400}
                  className="relative w-full h-auto"
                  priority
                />
              </div>
            </div>

            <div className="order-2 lg:order-2 lg:w-3/5">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
                  <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
                    {getGreeting()},
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white block mt-1">
                    {username}!
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  Как прошел ваш день?
                  <br className="hidden sm:block" />
                  Запечатлейте свои эмоции и создайте историю настроения.
                </p>
              </div>

              {analytics && analytics.summary.total_entries > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg sm:text-xl">📈</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                        Ваша статистика
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                        На основе {analytics.summary.total_entries} записей
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171]">
                        {analytics.summary.total_entries}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        записей
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171]">
                        {analytics.summary.days_active}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        дней
                      </div>
                    </div>
                  </div>

                  {analytics.summary.top_mood && (
                    <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-1">
                        Чаще всего:
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        {moodTranslations[analytics.summary.top_mood] ||
                          analytics.summary.top_mood}
                      </p>
                    </div>
                  )}

                  <Link href="/analytics">
                    <button className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base">
                      ✦ Подробная аналитика
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Быстрые действия
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link href="/stories/create">
              <div className="group bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0">
                      <span className="text-white text-xl sm:text-2xl">✐</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 text-center sm:text-left">
                      Создать запись
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm text-center sm:text-left">
                      Зафиксируйте текущее настроение
                    </p>
                  </div>
                  <div className="mt-auto pt-3 sm:pt-4 border-t border-white/20">
                    <span className="text-white text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      Быстрое добавление{" "}
                      <span className="text-sm sm:text-lg">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/stories">
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0">
                      <span className="text-white text-xl sm:text-2xl">📖</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 text-center sm:text-left">
                      История
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm text-center sm:text-left">
                      Все ваши записи настроения
                    </p>
                  </div>
                  <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-[#7F1D1D] dark:text-[#f87171] text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      Все записи <span className="text-sm sm:text-lg">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/analytics">
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0">
                      <span className="text-white text-xl sm:text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 text-center sm:text-left">
                      Аналитика
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm text-center sm:text-left">
                      Статистика и графики
                    </p>
                  </div>
                  <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-[#7F1D1D] dark:text-[#f87171] text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      Подробный анализ{" "}
                      <span className="text-sm sm:text-lg">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/auth/profile">
              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0">
                      <span className="text-white text-xl sm:text-2xl">⚙</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 text-center sm:text-left">
                      Профиль
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm text-center sm:text-left">
                      Настройки аккаунта
                    </p>
                  </div>
                  <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-[#7F1D1D] dark:text-[#f87171] text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      Настройки <span className="text-sm sm:text-lg">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {latestStory && (
          <section className="mb-10 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Последняя запись
              </h2>
              <Link href="/stories">
                <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base">
                  Все записи
                </button>
              </Link>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center flex-shrink-0">
                    <span className="text-white">📔</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {formatDate(latestStory.created_at)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(latestStory.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-2 justify-start sm:justify-start lg:justify-end mt-3 sm:mt-0">
                  {latestStory.moods.slice(0, 3).map((mood, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white text-xs sm:text-sm font-medium"
                    >
                      {moodTranslations[mood] || mood}
                    </span>
                  ))}
                  {latestStory.moods.length > 3 && (
                    <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">
                      +{latestStory.moods.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {latestStory.text && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {latestStory.text.length > 150
                      ? `${latestStory.text.substring(0, 150)}...`
                      : latestStory.text}
                  </p>
                </div>
              )}

              {getNormalizedPhotoUrls(latestStory).length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {getNormalizedPhotoUrls(latestStory)
                      .slice(0, 3)
                      .map((url, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden"
                        >
                          <Image
                            src={url}
                            alt={`Фото ${i + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link href={`/stories`} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-shadow text-sm sm:text-base mb-2 sm:mb-0">
                    Редактировать
                  </button>
                </Link>
                <Link href="/stories/create" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base">
                    + Новая запись
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Призыв к действию если нет записей */}
        {!latestStory && (
          <section className="mb-10 sm:mb-12">
            <div className="bg-gradient-to-r from-[#7F1D1D]/10 to-[#DC2626]/10 dark:from-[#7F1D1D]/20 dark:to-[#DC2626]/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
              <div className="text-4xl sm:text-5xl mb-4">✨</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Создайте свою первую запись!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto px-2">
                Начните отслеживать свои эмоции сегодня. Это поможет лучше
                понимать себя и улучшить качество жизни.
              </p>
              <Link href="/stories/create">
                <button className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow text-base sm:text-lg">
                  ✐ Начать дневник
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Баннер аналитики */}
        {analytics && analytics.summary.total_entries > 5 && (
          <section className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-white">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center">
                <div className="lg:w-2/3">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    📈 У вас уже есть данные для анализа!
                  </h3>
                  <p className="opacity-90 mb-4 sm:mb-6 text-sm sm:text-base">
                    На основе {analytics.summary.total_entries} записей мы можем
                    показать вам интересные закономерности в вашем настроении.
                  </p>
                  <Link href="/analytics">
                    <button className="px-4 py-2 sm:px-6 sm:py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg sm:rounded-xl font-bold backdrop-blur-sm transition-colors text-sm sm:text-base">
                      ✦ Детальная аналитика
                    </button>
                  </Link>
                </div>
                <div className="lg:w-1/3 text-center lg:text-right">
                  <div className="text-4xl sm:text-5xl lg:text-6xl">📊</div>
                  <p className="mt-2 sm:mt-4 opacity-80 text-xs sm:text-sm lg:text-base">
                    Откройте инсайты о вашем эмоциональном состоянии
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
