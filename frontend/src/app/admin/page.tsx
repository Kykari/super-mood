"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  UserCheck,
  UserX,
  BookOpen,
  Shield,
  BarChart3,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

interface Stats {
  total_users: number;
  active_users: number;
  blocked_users: number;
  total_stories: number;
  admins: number;
  regular_users: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/admin/stats`,
        { credentials: "include" },
      );

      if (res.status === 403) {
        toast.error("Доступ запрещён. Требуются права администратора.");
        router.push("/home");
        return;
      }

      if (!res.ok) throw new Error();

      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast.error("Ошибка загрузки статистики");
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    router.push("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F1D1D]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Всего пользователей",
      value: stats?.total_users || 0,
      icon: Users,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Активных",
      value: stats?.active_users || 0,
      icon: UserCheck,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Заблокированных",
      value: stats?.blocked_users || 0,
      icon: UserX,
      color: "from-red-500 to-red-700",
    },
    {
      title: "Всего записей",
      value: stats?.total_stories || 0,
      icon: BookOpen,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Администраторов",
      value: stats?.admins || 0,
      icon: Shield,
      color: "from-yellow-500 to-yellow-700",
    },
    {
      title: "Обычных пользователей",
      value: stats?.regular_users || 0,
      icon: Users,
      color: "from-cyan-500 to-cyan-700",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
            Админ-панель
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Управление пользователями и статистика
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/admin/users">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200">
              <Users className="w-4 h-4" />
              Пользователи
            </button>
          </Link>
          <button
            onClick={goToHome}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200"
          >
            <LogOut className="w-4 h-4" />
            На главную
          </button>
        </div>
      </div>

      {/* Статистика - карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 sm:p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <card.icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <span className="text-2xl sm:text-3xl font-bold">
                {card.value}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold opacity-90">
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/users">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all cursor-pointer">
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Управление пользователями
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Просмотр, редактирование, блокировка и удаление пользователей
            </p>
          </div>
        </Link>

        {/* <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-100 dark:border-gray-700 opacity-50">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Активности (скоро)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Управление активностями — в разработке
          </p>
        </div> */}
      </div>
    </div>
  );
}
