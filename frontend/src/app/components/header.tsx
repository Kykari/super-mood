"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { LogOut, User, Menu, X, Sun, Moon, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/auth/profile`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );
      setIsAuthenticated(res.ok);

      if (res.ok) {
        const userData = await res.json();
        setIsAdmin(userData.role === "ADMIN");
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        if (name && name.trim()) {
          document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });

      localStorage.clear();
      sessionStorage.clear();

      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsMobileMenuOpen(false);
      toast.success("Вы вышли из аккаунта");

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

  const hideHeaderPaths = ["/auth/login", "/auth/register"];
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
      <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] dark:from-gray-900 dark:to-gray-800"></div>

      <div className="relative flex items-center justify-between py-2 px-4 sm:px-6">
        {/* Левая часть - кнопка темы и меню для мобильных */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleThemeToggle}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-yellow-300" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Центр - логотип */}
        <div className="flex-1 flex justify-center">
          <Link href={isAuthenticated ? "/home" : "/"}>
            <h1 className="text-white font-black text-3xl py-2 tracking-wider drop-shadow-lg hover:scale-105 transition-transform cursor-pointer">
              SUPERMOOD
            </h1>
          </Link>
        </div>

        {/* Правая часть */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Кнопка админ-панели (только для админов) */}
                {isAdmin && (
                  <Link href="/admin" className="group relative">
                    <div className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-300 group-hover:scale-110 backdrop-blur-sm border border-white/20">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="group relative p-2 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>

                <Link href="/profile" className="group relative">
                  <div className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-300 group-hover:scale-110 backdrop-blur-sm border border-white/20">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="group relative">
                  <div className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 group-hover:scale-105 backdrop-blur-sm border border-white/20">
                    <span className="text-white font-medium">Войти</span>
                  </div>
                </Link>

                <Link href="/auth/register" className="group relative">
                  <div className="px-4 py-2 bg-white hover:bg-white/90 rounded-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-[#7F1D1D] font-medium">
                      Регистрация
                    </span>
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
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 hover:bg-white/20 rounded-xl"
                >
                  <span className="text-white font-medium">Профиль</span>
                  <span className="text-white/60">→</span>
                </Link>

                {/* Кнопка админ-панели в мобильном меню (только для админов) */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 hover:bg-white/20 rounded-xl"
                  >
                    <span className="text-white font-medium">Админ-панель</span>
                    <span className="text-white/60">→</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 hover:bg-white/20 rounded-xl"
                >
                  <span className="text-white font-medium">Выйти</span>
                  <span className="text-white/60">→</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 hover:bg-white/20 rounded-xl"
                >
                  <span className="text-white font-medium">Войти</span>
                  <span className="text-white/60">→</span>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl"
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
