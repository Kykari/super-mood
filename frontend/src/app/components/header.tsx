"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/profile`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const isAuth = res.ok;
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const handleLogout = async () => {
    try {
      // Сначала делаем запрос на сервер для выхода
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      toast.success("Вы вышли из аккаунта");
      setIsAuthenticated(false);
      setIsMobileMenuOpen(false);

      // Очищаем куки
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie =
          name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });

      localStorage.clear();
      sessionStorage.clear();

      // Перенаправляем на страницу логина
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ошибка при выходе из аккаунта");
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(`Тема: ${isDark ? "Светлая" : "Темная"}`);
  };

  // Не показываем хедер на страницах логина и регистрации
  const hideHeaderPaths = ["/auth/login", "/auth/register", "/auth"];
  if (hideHeaderPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] dark:from-gray-900 dark:to-gray-800"></div>
        <div className="relative flex items-center justify-between py-2 px-4">
          <div className="w-14 shrink-0"></div>
          <div className="flex-1 flex justify-center">
            <h1 className="text-white font-black text-3xl py-2 tracking-wider drop-shadow-lg">
              SUPERMOOD
            </h1>
          </div>
          <div className="w-14"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Фон хедера */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] dark:from-gray-900 dark:to-gray-800"></div>

      {/* Содержимое хедера */}
      <div className="relative flex items-center justify-between py-2 px-4 sm:px-6">
        {/* Левая часть - кнопка темы и меню для мобильных */}
        <div className="flex items-center gap-2">
          {/* Кнопка смены темы */}
          <button
            onClick={handleThemeToggle}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
            aria-label={
              isDark
                ? "Переключить на светлую тему"
                : "Переключить на темную тему"
            }
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {isDark ? (
                // Солнце
                <svg
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Луна
                <svg
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </div>
          </button>

          {/* Меню для мобильных */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
            aria-label="Меню"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Центральная часть - логотип */}
        <div className="flex-1 flex justify-center">
          <Link href={isAuthenticated ? "/home" : "/auth/login"}>
            <h1 className="text-white font-black text-3xl py-2 tracking-wider drop-shadow-lg hover:scale-105 transition-transform cursor-pointer">
              SUPERMOOD
            </h1>
          </Link>
        </div>

        {/* Правая часть - кнопки для десктопа */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            {/* Для авторизованных пользователей */}
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="group relative p-2 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                  aria-label="Выйти из аккаунта"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Выйти
                  </div>
                </button>

                <Link href="/auth/profile" className="group relative">
                  <div className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-300 group-hover:scale-110 backdrop-blur-sm border border-white/20">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Профиль
                  </div>
                </Link>
              </>
            ) : (
              // Для неавторизованных пользователей
              <>
                <Link href="/auth/login" className="group relative">
                  <div className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 group-hover:scale-105 backdrop-blur-sm border border-white/20">
                    <span className="text-white font-medium">Войти</span>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Войти в аккаунт
                  </div>
                </Link>

                <Link href="/auth/register" className="group relative">
                  <div className="px-4 py-2 bg-white hover:bg-white/90 rounded-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-[#7F1D1D] font-medium">
                      Регистрация
                    </span>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Создать аккаунт
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 backdrop-blur-2xl bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] dark:from-gray-900 dark:to-gray-800 border-t border-white/20">
          <div className="p-4 space-y-4">
            {/* Для авторизованных пользователей */}
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-white font-medium">Профиль</span>
                  </div>
                  <span className="text-white/60">→</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-white font-medium">Выйти</span>
                  </div>
                  <span className="text-white/60">→</span>
                </button>
              </>
            ) : (
              // Для неавторизованных пользователей
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <span className="text-white font-medium">Войти</span>
                  <span className="text-white/60">→</span>
                </Link>

                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 bg-white hover:bg-white/90 rounded-xl transition-all duration-300"
                >
                  <span className="text-[#7F1D1D] font-medium">
                    Регистрация
                  </span>
                  <span className="text-[#7F1D1D]/60">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
