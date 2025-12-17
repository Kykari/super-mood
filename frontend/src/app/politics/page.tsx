import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition min-h-screen">
      <div className="container mx-auto px-6 sm:px-8 lg:px-20 py-32">
        {/* Заголовок */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              ПОЛИТИКА
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              КОНФИДЕНЦИАЛЬНОСТИ
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Ваша приватность — наш приоритет. Узнайте, как мы защищаем и
            обрабатываем ваши данные
          </p>
        </section>

        {/* Основной контент */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 dark:border-gray-700">
            {/* Введение */}
            <div className="mb-12">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Настоящая политика конфиденциальности объясняет, как мы,
                компания-разработчик сайта SuperMood, собираем, используем,
                храним и защищаем ваши личные данные при использовании нашего
                сайта и связанных с ним сервисов.
              </p>
            </div>

            {/* Разделы политики */}
            <div className="space-y-12">
              {/* 1. Какие данные мы собираем */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    1
                  </span>
                  Какие данные мы собираем
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Мы можем собирать следующую информацию:
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Личные данные, такие как имя, электронная почта, при
                      регистрации или использовании определенных функций сайта.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Информацию о вашем настроении, которую вы вводите в трекер
                      (например, оценки, комментарии).
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Технические данные: IP-адрес, тип устройства, браузер,
                      операционная система, время доступа.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Данные о вашей активности на сайте: посещенные страницы,
                      время сеанса, взаимодействия с интерфейсом.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 2. Как мы используем ваши данные */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    2
                  </span>
                  Как мы используем ваши данные
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Ваши личные данные используются для:
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Предоставления и улучшения работы сервиса.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Персонализации опыта использования сайта.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Обеспечения безопасности и предотвращения мошенничества.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Связи с вами по вопросам поддержки, обновлений и новостей
                      (при согласии).
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Аналитики и исследования для улучшения функционала сайта.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 3. Передача данных третьим лицам */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    3
                  </span>
                  Передача данных третьим лицам
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Мы не передаем ваши личные данные третьим лицам без вашего
                    согласия, за исключением случаев, предусмотренных
                    законодательством, например:
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      По требованию государственных органов.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>В случаях,
                      связанных с обеспечением безопасности сайта.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      При передаче прав на проект или его части.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 4. Защита данных */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    4
                  </span>
                  Защита данных
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Мы принимаем все разумные технические и организационные меры
                    для защиты ваших данных от несанкционированного доступа,
                    изменения, раскрытия или уничтожения.
                  </p>
                </div>
              </section>

              {/* 5. Ваши права */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    5
                  </span>
                  Ваши права
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Вы имеете право:
                  </p>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Требовать доступ к своим данным.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Требовать исправления или удаления своих данных.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Отказаться от получения маркетинговых сообщений.
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DC2626] mr-2">•</span>
                      Обращаться с вопросами и жалобами по поводу обработки
                      данных.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 6. Использование файлов cookies */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    6
                  </span>
                  Использование файлов cookies
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Наш сайт использует файлы cookies для анализа посещаемости и
                    улучшения пользовательского опыта. Вы можете настроить
                    параметры cookies через настройки браузера.
                  </p>
                </div>
              </section>

              {/* 7. Изменения политики конфиденциальности */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    7
                  </span>
                  Изменения политики конфиденциальности
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Мы оставляем за собой право вносить изменения в данную
                    политику конфиденциальности. Обновленная версия публикуется
                    на этой странице и вступает в силу с момента публикации.
                  </p>
                </div>
              </section>

              {/* 8. Контакты */}
              <section className="group hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4">
                    8
                  </span>
                  Контакты
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Если у вас есть вопросы или пожелания относительно обработки
                    ваших данных, пожалуйста, свяжитесь с нами по адресу:{" "}
                    <span className="text-[#7F1D1D] dark:text-[#f87171] font-semibold">
                      SuperMood@gmail.com
                    </span>
                  </p>
                </div>
              </section>
            </div>

            {/* Кнопка возврата */}
            <div className="text-center mt-12">
              <Link href="/">
                <button className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] hover:from-[#991B1B] hover:to-[#ef4444] text-white px-8 sm:px-12 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                  Вернуться на главную
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
