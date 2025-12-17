import Link from "next/link";

export default function Feedback() {
  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition min-h-screen">
      <div className="container mx-auto px-6 sm:px-8 lg:px-20 py-24">
        <section className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              ОБРАТНАЯ СВЯЗЬ
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Не стесняйтесь обращаться к нам по любому вопросу
          </p>
        </section>
        <section className="max-w-lg mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <form className="space-y-6">
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-base font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent transition-all duration-300 group-hover:shadow-md text-sm"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-base font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Электронная почта
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent transition-all duration-300 group-hover:shadow-md text-sm"
                  placeholder="Введите вашу электронную почту"
                  required
                />
              </div>
              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-base font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent resize-none transition-all duration-300 group-hover:shadow-md text-sm"
                  placeholder="Расскажите нам о вашем вопросе или предложении..."
                  required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] hover:from-[#991B1B] hover:to-[#ef4444] text-white px-6 py-4 rounded-xl text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Отправить
                </button>
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Email:{" "}
                  <span className="text-[#7F1D1D] dark:text-[#f87171] font-semibold">
                    SuperMood@gmail.com
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Обычно мы отвечаем в течение 24 часов
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="text-center mt-8">
          <Link href="/">
            <button className="bg-transparent border border-[#7F1D1D] text-[#7F1D1D] dark:border-[#f87171] dark:text-[#f87171] hover:bg-[#7F1D1D] hover:text-white dark:hover:bg-[#f87171] dark:hover:text-white px-6 py-3 rounded-xl text-base font-semibold transition-all duration-500 transform hover:scale-105">
              Вернуться на главную
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
