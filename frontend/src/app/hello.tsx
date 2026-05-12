import Image from "next/image";
import Link from "next/link";
import ThemeCard from "./components/DarkTheme";
import {
  Brain,
  Sparkles,
  Camera,
  BarChart,
  NotebookPen,
  TrendingUp,
  Heart,
  Smile,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Анализ настроения",
    description:
      "Система анализирует ваши паттерны настроения и дает персонализированные рекомендации на основе данных",
  },
  {
    icon: Heart,
    title: "Забота о себе",
    description:
      "Регулярное ведение дневника помогает лучше понимать себя и свои эмоции",
  },
  {
    icon: TrendingUp,
    title: "Прогресс и динамика",
    description:
      "Отслеживайте изменения своего эмоционального состояния с помощью наглядных графиков и диаграмм",
  },
];

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition">
      <div className="container mx-auto">
        <section className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <div className="max-w-xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
                    SUPER MOOD
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">
                    Трекер настроения
                  </span>
                </h1>

                <h2 className="text-xl sm:text-2xl text-gray-800 dark:text-white font-light leading-tight mt-3">
                  Отслеживай эмоции,
                  <br />
                  <span className="font-medium">управляй своим днем!</span>
                </h2>

                <p className="text-sm sm:text-base my-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  SUPER MOOD — это умный дневник эмоций, который помогает
                  понимать себя, анализировать настроение и находить связь между
                  активностями и эмоциональным состоянием.
                </p>

                <div className="flex gap-4 mt-6">
                  <Link href="/auth/register">
                    <button className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] hover:from-[#991B1B] hover:to-[#ef4444] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      Начать вести дневник
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative flex justify-center">
                <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] relative">
                  <Image
                    src="/dogPlay.png"
                    alt="такса"
                    fill
                    className="object-contain rounded-3xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Ваш простой дневник настроения
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
              <div className="flex flex-col gap-12 lg:gap-16">
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-4 text-center">
                    Записывайте настроение мгновенно
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-sm sm:text-base">
                    Вносите записи о своем настроении всего за несколько секунд.
                    Отмечайте эмоции и состояние без лишних усилий
                  </p>
                </div>

                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-4 text-center">
                    Прикрепляйте фотографии
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-sm sm:text-base">
                    Загружайте фотографии, которые отражают ваше настроение или
                    важные моменты
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative group max-w-[250px] mx-auto">
                  <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
                  <Image
                    src="/phone1.jpg"
                    alt="скриншот1"
                    width={250}
                    height={500}
                    className="relative rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 w-full h-auto object-contain"
                  />
                </div>
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105 mt-8 lg:mt-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-4 text-center">
                    Планируйте позитивные привычки
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-sm sm:text-base">
                    Создавайте цели и напоминания для поддержания хорошего
                    настроения и повышения качества жизни
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-12 lg:gap-16">
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-4 text-center">
                    Анализируйте свои эмоции с графиками
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-sm sm:text-base">
                    Отслеживайте динамику настроения с наглядными диаграммами и
                    графиками, чтобы лучше понимать свои чувства
                  </p>
                </div>

                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-4 text-center">
                    Создавайте мотивирующие заметки
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-sm sm:text-base">
                    Наполняйте журнал вдохновением, чтобы поднимать настроение в
                    сложные моменты
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-5xl mx-auto">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-2 lg:mb-4">
                  Удобная система оценки
                </h2>
                <p className="font-light text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Выбирайте из 24 эмоций и десятков активностей, чтобы ваш
                  дневник настроения отражал именно ваше состояние —{" "}
                  <span className="font-semibold dark:text-white">
                    без шаблонов и ограничений!
                  </span>
                </p>

                <h3 className="font-semibold text-xl sm:text-2xl my-2 lg:my-4 text-gray-900 dark:text-white">
                  Почему это важно?
                </h3>

                <p className="font-light text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-2 lg:mb-4 leading-relaxed">
                  Чем детальнее вы анализируете своё состояние, тем проще
                  находить{" "}
                  <span className="italic font-normal dark:text-white">
                    закономерности:
                  </span>
                </p>

                <ul className="font-light text-lg sm:text-xl text-gray-600 dark:text-gray-300 space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                  <li>→ После каких дел вы чувствуете прилив энергии?</li>
                  <li>→ Какие ситуации чаще всего вызывают стресс?</li>
                  <li>→ Что помогает вам вернуть баланс?</li>
                </ul>

                <p className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-white">
                  SUPER MOOD — это не просто трекер, а ваш личный гид к
                  осознанности!
                </p>
              </div>

              <div className="relative group max-w-[250px] mx-auto">
                <div className="absolute -inset-4 sm:-inset-6  rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
                <Image
                  src="/phone3.jpg"
                  alt="скриншот2"
                  width={250}
                  height={500}
                  className="relative rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Эксклюзивные возможности
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Откройте для себя премиум-функции, созданные для вашего
                благополучия и личного роста
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 lg:p-10 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105"
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-3xl flex items-center justify-center mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base lg:text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Цвета, которые говорят за вас
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Подберите тему под свой ритм жизни. Спокойствие, энергия или
                баланс — решать только вам!
                <br />
                <span className="font-semibold dark:text-white">
                  Попробуйте!
                </span>
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <ThemeCard
                  title="Светлая тема"
                  theme="light"
                  gradient="from-[#7F1D1D] via-[#991B1B] to-[#DC2626]"
                  description="Чистота и ясность"
                />
                <ThemeCard
                  title="Темная тема"
                  theme="dark"
                  gradient="from-gray-900 via-gray-800 to-gray-700"
                  description="Элегантность и концентрация"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-5xl mx-auto">
              <div className="relative group order-2 lg:order-1 max-w-[250px] mx-auto">
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
                <Image
                  src="/phone6.jpg"
                  alt="скриншот3"
                  width={250}
                  height={500}
                  className="relative rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 w-full h-auto object-contain"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 lg:mb-8 text-right">
                  Такса — ваш проводник в мире эмоций
                </h2>

                <p className="font-light text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 lg:mb-8 leading-relaxed text-right">
                  Наш талисман — черно-подпалая такса — всегда готова поддержать
                  вас. Она анализирует ваши записи и делится полезными
                  наблюдениями и инсайтами, помогая лучше понимать свои эмоции.
                </p>

                <div className="font-light text-lg sm:text-xl space-y-3 lg:space-y-4 text-gray-600 dark:text-gray-300 mb-6 lg:mb-8 text-right">
                  <p>✓ Получайте персональные рекомендации</p>
                  <p>✓ Отслеживайте динамику настроения</p>
                  <p>✓ Открывайте новые грани самопознания</p>
                </div>

                <p className="font-medium text-xl sm:text-2xl text-gray-900 dark:text-white text-right leading-tight">
                  Присоединяйтесь к SUPER MOOD и начните путь к эмоциональному
                  балансу!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
