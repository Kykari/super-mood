"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface UserData {
  username: string;
  email: string;
  bio: string | null;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [originalUser, setOriginalUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">(
    "profile"
  );
  const [loading, setLoading] = useState(true);

  // Загрузка профиля при входе
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
          }/auth/profile`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          if (res.status === 401) router.push("/auth/login");
          throw new Error("Не удалось загрузить профиль");
        }

        const data = await res.json();
        const userData = {
          username: data.username,
          email: data.email,
          bio: data.bio || "",
        };
        setUser(userData);
        setOriginalUser(userData);
      } catch (err) {
        toast.error("Ошибка загрузки профиля");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // Сохранение профиля
  const handleSave = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/profile`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(user),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка сохранения");
      }

      setOriginalUser(user);
      setIsEditing(false);
      toast.success("Профиль успешно обновлён!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
  };

  // Смена пароля
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      current_password: form.get("current") as string,
      new_password: form.get("new") as string,
      confirm_password: form.get("confirm") as string,
    };

    if (data.new_password !== data.confirm_password) {
      toast.error("Новый пароль и подтверждение не совпадают");
      return;
    }

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Ошибка смены пароля");

      toast.success("Пароль успешно изменён!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Удаление аккаунта
  const handleDeleteAccount = async () => {
    if (!confirm("Ты уверена? Это действие нельзя отменить!")) return;

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/delete-account`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Не удалось удалить аккаунт");

      toast.success("Аккаунт удалён");
      document.cookie = "access_token=; Max-Age=0; path=/;";
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Загрузка профиля...
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    {
      id: "profile",
      label: "Профиль",
      activeIcon: "/pencil1.svg",
      inactiveIcon: "/pencil2.svg",
    },
    {
      id: "password",
      label: "Пароль",
      activeIcon: "/key1.svg",
      inactiveIcon: "/key2.svg",
    },
    {
      id: "danger",
      label: "Удалить аккаунт",
      activeIcon: "/delete1.svg",
      inactiveIcon: "/delete2.svg",
    },
  ];

  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
                ПРОФИЛЬ
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Боковая навигация */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full text-left px-4 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3
                        ${
                          activeTab === item.id
                            ? item.id === "danger"
                              ? "bg-[#7F1D1D] text-white shadow-lg"
                              : "bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white shadow-lg"
                            : item.id === "danger"
                            ? "text-[#7F1D1D] hover:bg-red-50 dark:hover:bg-red-900/20"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      <Image
                        src={
                          activeTab === item.id
                            ? item.activeIcon
                            : item.inactiveIcon
                        }
                        width={24}
                        height={24}
                        alt={item.label}
                      />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Основной контент */}
            <div className="lg:col-span-3">
              {/* Вкладка Профиль */}
              {activeTab === "profile" && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                  <div className="space-y-8">
                    {/* Аватарка (пока заглушка) */}
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-3xl bg-gray-200 dark:bg-gray-700 border-4 border-dashed border-gray-400 flex items-center justify-center">
                        <span className="text-4xl text-gray-500">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#7F1D1D] dark:text-[#f87171] mb-2">
                          Имя пользователя
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={user.username}
                            onChange={(e) =>
                              setUser({ ...user, username: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#7F1D1D] focus:outline-none"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                            {user.username}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#7F1D1D] dark:text-[#f87171] mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                              setUser({ ...user, email: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#7F1D1D] focus:outline-none"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                            {user.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#7F1D1D] dark:text-[#f87171] mb-2">
                          О себе
                        </label>
                        {isEditing ? (
                          <textarea
                            value={user.bio || ""}
                            onChange={(e) =>
                              setUser({ ...user, bio: e.target.value })
                            }
                            rows={4}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none focus:ring-2 focus:ring-[#7F1D1D] focus:outline-none"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl min-h-32">
                            {user.bio || "Расскажите немного о себе..."}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-4 pt-6">
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Редактировать профиль
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={handleSave}
                              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300"
                            >
                              Отмена
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Вкладка Пароль */}
              {activeTab === "password" && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-8">
                    Изменение пароля
                  </h2>
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-6 max-w-md"
                  >
                    <input
                      name="current"
                      type="password"
                      placeholder="Текущий пароль"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#7F1D1D] focus:outline-none"
                    />
                    <input
                      name="new"
                      type="password"
                      placeholder="Новый пароль"
                      required
                      minLength={8}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#7F1D1D] focus:outline-none"
                    />
                    <input
                      name="confirm"
                      type="password"
                      placeholder="Подтвердите новый пароль"
                      required
                      minLength={8}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#7F1D1D] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Изменить пароль
                    </button>
                  </form>
                </div>
              )}

              {/* Вкладка Удаление */}
              {activeTab === "danger" && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-[#7F1D1D] dark:text-[#f87171] mb-8">
                    Опасная зона
                  </h2>
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4">
                      Удаление аккаунта
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-8">
                      После удаления все твои данные будут безвозвратно стёрты.
                      Это действие нельзя отменить.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300"
                    >
                      Удалить аккаунт навсегда
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
