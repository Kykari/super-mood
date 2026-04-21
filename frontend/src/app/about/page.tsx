import Image from "next/image";
import Link from "next/link";
import BackToHome from "../components/BackToHome";
import { Zap, Palette, Code, Heart } from "lucide-react";

export default function About() {
  const techStack = [
    {
      name: "Next.js",
      description: "React-фреймворк для производства",
      icon: Zap,
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Tailwind CSS",
      description: "Утилитарный CSS-фреймворк",
      icon: Palette,
      color: "from-cyan-500 to-teal-500",
    },
    {
      name: "Python",
      description: "Язык для анализа данных и бэкенда",
      icon: Code,
      color: "from-yellow-500 to-amber-600",
    },
  ];

  const features = [
    {
      title: "Осознанность",
      description: "Помогаем лучше понимать свои эмоции и их причины",
    },
    {
      title: "Регулярность",
      description: "Формируем привычку отслеживать настроение",
    },
    {
      title: "Анализ",
      description: "Находим закономерности в вашем эмоциональном состоянии",
    },
    {
      title: "Развитие",
      description: "Даем инструменты для улучшения качества жизни",
    },
  ];

  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition min-h-screen">
      <div className="container mx-auto px-6 sm:px-8 lg:px-20 py-8">
        <BackToHome />
        <section className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              О SUPERMOOD
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Эмоциональный интеллект начинается с самопознания. Мы создали
            инструмент, который помогает вам на этом пути.
          </p>
        </section>

        <section className="max-w-6xl mx-auto mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Наша{" "}
                <span className="text-[#7F1D1D] dark:text-[#f87171]">
                  миссия
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                SuperMood — это не просто трекер настроения. Это ваш личный
                проводник в мир осознанного отношения к эмоциям и психическому
                благополучию.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Мы верим, что понимание своих эмоциональных паттернов — ключ к
                более сбалансированной и продуктивной жизни. Наша цель — сделать
                заботу о ментальном здоровье доступной и привычной практикой для
                каждого.
              </p>
              <div className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-2xl p-6 text-white">
                <p className="text-lg font-semibold italic">
                  "Эмоции — это не враги, а союзники. Научитесь слушать их — и
                  они станут вашими проводниками к лучшей версии себя."
                </p>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/dogPlay.png"
                alt="Концепция SuperMood"
                width={500}
                height={500}
                className=" w-full h-auto"
              />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Наши{" "}
              <span className="text-[#7F1D1D] dark:text-[#f87171]">
                принципы
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Четыре столпа, на которых строится философия SuperMood
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Технологии{" "}
              <span className="text-[#7F1D1D] dark:text-[#f87171]">
                разработки
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Современный стек технологий для создания лучшего пользовательского
              опыта
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {tech.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 dark:bg-gray-700/50 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Почему именно этот стек?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Next.js обеспечивает молниеносную производительность, Tailwind CSS
              даёт неограниченные возможности кастомизации, а Python отлично
              справляется с анализом данных и машинным обучением для
              персонализированных рекомендаций.
            </p>
          </div>
          <div className="text-center mt-8">
            <p className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              С любовью к вашему ментальному здоровью
              <Heart className="w-4 h-4 text-red-500" />
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
