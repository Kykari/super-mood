"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Trash2,
  ArrowLeft,
  Lock,
  Unlock,
} from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  avatar_url: string | null;
  blocked_reason?: string;
}

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  username: string;
  onBlock: () => void;
}

function BlockUserModal({
  isOpen,
  onClose,
  userId,
  username,
  onBlock,
}: BlockModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBlock = async () => {
    if (!reason.trim()) {
      toast.error("Укажите причину блокировки");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/admin/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ is_active: false, blocked_reason: reason }),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Пользователь заблокирован");
      onBlock();
      onClose();
      setReason("");
    } catch (error) {
      toast.error("Ошибка блокировки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Блокировка пользователя
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <span className="text-xl text-gray-700 dark:text-gray-300">✕</span>
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Вы собираетесь заблокировать пользователя{" "}
          <strong className="text-gray-900 dark:text-white">{username}</strong>
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Причина блокировки
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите причину блокировки..."
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-[#7F1D1D] outline-none"
            rows={3}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBlock}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Блокировка..." : "Заблокировать"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [blockModal, setBlockModal] = useState({
    isOpen: false,
    userId: 0,
    username: "",
  });
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterRole) params.append("role", filterRole);
      if (filterActive !== "") {
        params.append(
          "is_active",
          filterActive === "active" ? "true" : "false",
        );
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/admin/users?${params.toString()}`,
        { credentials: "include" },
      );

      if (res.status === 403) {
        toast.error("Доступ запрещён");
        router.push("/home");
        return;
      }

      if (!res.ok) throw new Error();

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  }, [search, filterRole, filterActive, router]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search, filterRole, filterActive, loadUsers]);

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/admin/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Ошибка обновления роли");
      }

      toast.success("Роль обновлена");
      loadUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const unblockUser = async (userId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/admin/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ is_active: true, blocked_reason: null }),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Пользователь разблокирован");
      loadUsers();
    } catch (error) {
      toast.error("Ошибка разблокировки");
    }
  };

  const deleteUser = async (userId: number, username: string) => {
    if (
      !confirm(
        `Удалить пользователя ${username}? Это действие нельзя отменить.`,
      )
    )
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/admin/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Пользователь удалён");
      loadUsers();
    } catch (error) {
      toast.error("Ошибка удаления");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
              Управление пользователями
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Всего пользователей: {users.length}
            </p>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7F1D1D] outline-none text-sm"
            />
          </div>
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7F1D1D] outline-none text-sm"
        >
          <option value="">Все роли</option>
          <option value="USER">Пользователь</option>
          <option value="ADMIN">Администратор</option>
        </select>

        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7F1D1D] outline-none text-sm"
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="blocked">Заблокированные</option>
        </select>
      </div>

      {/* Список пользователей */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7F1D1D]"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Левая часть — аватар + информация */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.username}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      user.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {user.username}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${user.role === "ADMIN" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
                      >
                        {user.role === "ADMIN" ? "Админ" : "Пользователь"}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${user.is_active ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}
                      >
                        {user.is_active ? "Активен" : "Заблокирован"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Регистрация: {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>

                {/* Правая часть — действия */}
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="USER">Пользователь</option>
                    <option value="ADMIN">Администратор</option>
                  </select>

                  {user.is_active ? (
                    <button
                      onClick={() =>
                        setBlockModal({
                          isOpen: true,
                          userId: user.id,
                          username: user.username,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Заблокировать
                    </button>
                  ) : (
                    <button
                      onClick={() => unblockUser(user.id)}
                      className="px-3 py-1.5 rounded-xl text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-1"
                    >
                      <Unlock className="w-3 h-3" />
                      Разблокировать
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(user.id, user.username)}
                    className="p-1.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!user.is_active && user.blocked_reason && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    <span className="font-medium">Причина блокировки:</span>{" "}
                    {user.blocked_reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <BlockUserModal
        isOpen={blockModal.isOpen}
        onClose={() =>
          setBlockModal({ isOpen: false, userId: 0, username: "" })
        }
        userId={blockModal.userId}
        username={blockModal.username}
        onBlock={loadUsers}
      />
    </div>
  );
}
