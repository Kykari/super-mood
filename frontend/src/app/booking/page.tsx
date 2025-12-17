"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

interface Psychologist {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
}

export default function Psychologists() {
  const [selectedPsychologist, setSelectedPsychologist] =
    useState<Psychologist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const psychologists: Psychologist[] = [
    {
      id: 1,
      name: "Анна Петрова",
      specialization: "Когнитивно-поведенческая терапия",
      experience: "8 лет",
      price: "3 500 ₽/сессия",
      rating: 4.9,
      reviews: 127,
      image: "/psychologist1.jpg",
      description:
        "Специализируюсь на работе с тревожностью, паническими атаками и депрессией. Помогаю развивать навыки эмоциональной регуляции.",
    },
    {
      id: 2,
      name: "Максим Иванов",
      specialization: "Гештальт-терапия",
      experience: "6 лет",
      price: "4 000 ₽/сессия",
      rating: 4.8,
      reviews: 89,
      image: "/psychologist2.jpg",
      description:
        "Работаю с отношениями, самооценкой и экзистенциальными вопросами. Интегративный подход с элементами арт-терапии.",
    },
    {
      id: 3,
      name: "Елена Смирнова",
      specialization: "Семейная психология",
      experience: "12 лет",
      price: "5 000 ₽/сессия",
      rating: 5.0,
      reviews: 203,
      image: "/psychologist3.jpg",
      description:
        "Помогаю парам и семьям выстраивать гармоничные отношения. Работаю с кризисами и конфликтами в отношениях.",
    },
  ];

  const timeSlots: string[] = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const handleBooking = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPsychologist) return;

    // Здесь будет логика отправки данных
    alert(
      `Запись успешно оформлена! ${selectedPsychologist.name} ждет вас ${selectedDate} в ${selectedTime}`
    );
  };

  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition min-h-screen">
      <div className="container mx-auto px-6 sm:px-8 lg:px-20 py-24">
        {/* Заголовок */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              ЗАПИСЬ К ПСИХОЛОГУ
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Профессиональная психологическая помощь от проверенных специалистов
            Выберите психолога и удобное время для консультации
          </p>
        </section>

        {/* Список психологов */}
        <section className="max-w-6xl mx-auto mb-14">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Наши{" "}
              <span className="text-[#7F1D1D] dark:text-[#f87171]">
                специалисты
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Все психологи имеют высшее образование и регулярно проходят
              супервизию
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {psychologists.map((psychologist) => (
              <div
                key={psychologist.id}
                className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 transition-all duration-500 cursor-pointer ${
                  selectedPsychologist?.id === psychologist.id
                    ? "border-[#7F1D1D] dark:border-[#f87171] scale-105"
                    : "border-gray-100 dark:border-gray-700 hover:scale-105"
                }`}
                onClick={() => setSelectedPsychologist(psychologist)}
              >
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {psychologist.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {psychologist.name}
                  </h3>
                  <p className="text-[#7F1D1D] dark:text-[#f87171] font-semibold text-sm">
                    {psychologist.specialization}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Опыт:</span>
                    <span className="font-semibold">
                      {psychologist.experience}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Стоимость:</span>
                    <span className="font-semibold">{psychologist.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Рейтинг:</span>
                    <span className="font-semibold flex items-center">
                      ⭐ {psychologist.rating} ({psychologist.reviews} отзывов)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                  {psychologist.description}
                </p>

                <button
                  className={`w-full mt-4 py-2 rounded-xl font-semibold transition-all ${
                    selectedPsychologist?.id === psychologist.id
                      ? "bg-[#7F1D1D] text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#7F1D1D] hover:text-white"
                  }`}
                >
                  {selectedPsychologist?.id === psychologist.id
                    ? "Выбрано"
                    : "Выбрать"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Форма записи */}
        {selectedPsychologist && (
          <section className="max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Запись к {selectedPsychologist.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Выберите удобную дату и время для консультации
                </p>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Дата */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Дата консультации
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent"
                    required
                  />
                </div>

                {/* Время */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Время консультации
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? "bg-[#7F1D1D] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#7F1D1D] hover:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Контактные данные */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent"
                      placeholder="Введите ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent"
                      placeholder="+7 (___)-___-__-__"
                      required
                    />
                  </div>
                </div>

                {/* Комментарий */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Комментарий (необязательно)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent resize-none"
                    placeholder="Опишите кратко вашу ситуацию или вопросы, которые хотите обсудить..."
                  />
                </div>

                {/* Кнопка отправки */}
                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] hover:from-[#991B1B] hover:to-[#ef4444] text-white px-6 py-4 rounded-xl text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Записаться на консультацию
                </button>
              </form>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                  💡 Консультация проходит онлайн через защищенный видеозвонок.
                  Ссылка для подключения придет за 30 минут до начала сессии.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
