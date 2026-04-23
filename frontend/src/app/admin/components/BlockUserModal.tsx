// app/admin/components/BlockUserModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  username: string;
  onBlock: () => void;
}

export default function BlockUserModal({
  isOpen,
  onClose,
  userId,
  username,
  onBlock,
}: BlockUserModalProps) {
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
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Вы собираетесь заблокировать пользователя <strong>{username}</strong>
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Причина блокировки
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите причину блокировки..."
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none focus:ring-2 focus:ring-[#7F1D1D] outline-none"
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
