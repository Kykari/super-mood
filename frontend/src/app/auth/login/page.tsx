"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = new URLSearchParams();
    data.append("username", formData.get("username") as string);
    data.append("password", formData.get("password") as string);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          credentials: "include",
          body: data.toString(),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.detail || "Неверный логин или пароль");
        return;
      }

      const result = await res.json();
      console.log("Логин успешен:", result);

      toast.success("Добро пожаловать обратно!");

      // ПЕРЕНАПРАВЛЕНИЕ НА ГЛАВНУЮ
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (err) {
      console.error("Ошибка логина:", err);
      toast.error("Сервер недоступен");
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

            {/* Форма логина */}
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
                  Вход в аккаунт
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                  С возвращением! Рады видеть вас снова
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
                      placeholder="ivan_ivanov"
                      required
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
                      placeholder="Введите пароль"
                      required
                      className="w-full px-4 py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#7F1D1D] focus:ring-2 focus:ring-[#7F1D1D]/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#7F1D1D] rounded focus:ring-[#7F1D1D] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        Запомнить меня
                      </span>
                    </label>

                    <Link
                      href="#"
                      className="text-sm text-[#7F1D1D] dark:text-[#f87171] hover:underline"
                    >
                      Забыли пароль?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Вход..." : "Войти в аккаунт"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                    Нет аккаунта?{" "}
                    <Link
                      href="/auth/register"
                      className="text-[#7F1D1D] dark:text-[#f87171] font-bold hover:underline"
                    >
                      Зарегистрироваться
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#7F1D1D] dark:hover:text-[#f87171] transition-colors"
                  >
                    ← Вернуться на главную
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Входя в аккаунт, вы соглашаетесь с нашими условиями
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
