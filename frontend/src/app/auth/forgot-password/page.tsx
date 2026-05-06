"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Шаг 1: Отправка кода на почту
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Код отправлен на почту!");
        setStep("code");
      } else {
        toast.error(data.detail || "Ошибка");
      }
    } catch (error) {
      toast.error("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  // Шаг 2: Подтверждение кода
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/auth/verify-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Код подтверждён!");
        setResetToken(data.reset_token);
        setUserId(data.user_id);
        setStep("password");
      } else {
        toast.error(data.detail || "Неверный код");
      }
    } catch (error) {
      toast.error("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  // Шаг 3: Установка нового пароля
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newPassword = (
      form.elements.namedItem("new_password") as HTMLInputElement
    ).value;
    const confirmPassword = (
      form.elements.namedItem("confirm_password") as HTMLInputElement
    ).value;

    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reset_token: resetToken,
            user_id: userId,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Пароль изменён!");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        toast.error(data.detail || "Ошибка");
      }
    } catch (error) {
      toast.error("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  // Форма ввода email
  if (step === "email") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              Восстановление пароля
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Введите email, мы отправим код
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSendCode} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7F1D1D] outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Отправить код"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Форма ввода кода
  if (step === "code") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <button
              onClick={() => setStep("email")}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              Подтверждение
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Введите код из письма
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7F1D1D] outline-none"
              />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-[0.5rem] focus:ring-2 focus:ring-[#7F1D1D] outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {loading ? "Проверка..." : "Подтвердить"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Форма нового пароля
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={() => setStep("code")}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
            Новый пароль
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Придумайте новый пароль
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <input
              type="password"
              name="new_password"
              placeholder="Новый пароль"
              minLength={6}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7F1D1D] outline-none"
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Подтвердите пароль"
              minLength={6}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7F1D1D] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Установить пароль"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
