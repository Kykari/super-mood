"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.detail || "Ошибка регистрации");
        return;
      }

      const result = await res.json();
      console.log("Регистрация успешна:", result);

      toast.success("Аккаунт создан! Добро пожаловать!");

      // ПЕРЕНАПРАВЛЕНИЕ НА ГЛАВНУЮ
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);

      if (err.message?.includes("fetch")) {
        toast.error("Сервер недоступен");
      } else {
        toast.error("Нет соединения с сервером");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="min-h-screen flex items-center justify-center py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center max-w-6xl w-full">
            {/* Изображение таксы */}
            <div className="order-2 lg:order-1">
              <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full">
                <Image
                  src="/dogSit.png"
                  alt="Такса"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-2xl lg:rounded-3xl shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* Форма регистрации */}
            <div className="order-1 lg:order-2">
              <div className="text-center mb-6 sm:mb-8">
                <Link href="/" className="inline-block mb-2">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black">
                    <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
                      SUPER MOOD
                    </span>
                  </div>
                </Link>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Создание аккаунта
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                  Присоединяйтесь к нашему сообществу
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Имя пользователя
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="ivan_ivanov"
                      className="w-full px-4 py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#7F1D1D] focus:ring-2 focus:ring-[#7F1D1D]/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@mail.com"
                      className="w-full px-4 py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#7F1D1D] focus:ring-2 focus:ring-[#7F1D1D]/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Пароль
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Минимум 6 символов"
                      className="w-full px-4 py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#7F1D1D] focus:ring-2 focus:ring-[#7F1D1D]/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Подтвердите пароль
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Повторите пароль"
                      className="w-full px-4 py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#7F1D1D] focus:ring-2 focus:ring-[#7F1D1D]/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      required
                      className="w-4 h-4 mt-1 text-[#7F1D1D] rounded focus:ring-[#7F1D1D] border-gray-300"
                      disabled={loading}
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="ml-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      Я согласен с{" "}
                      <Link
                        href="#"
                        className="text-[#7F1D1D] dark:text-[#f87171] hover:underline"
                      >
                        условиями использования
                      </Link>{" "}
                      и{" "}
                      <Link
                        href="#"
                        className="text-[#7F1D1D] dark:text-[#f87171] hover:underline"
                      >
                        политикой конфиденциальности
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Создание аккаунта..." : "Создать аккаунт"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                    Уже есть аккаунт?{" "}
                    <Link
                      href="/auth/login"
                      className="text-[#7F1D1D] dark:text-[#f87171] font-bold hover:underline"
                    >
                      Войти
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/home"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#7F1D1D] dark:hover:text-[#f87171] transition-colors"
                  >
                    ← Вернуться на главную
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Регистрируясь, вы соглашаетесь с нашими условиями
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
