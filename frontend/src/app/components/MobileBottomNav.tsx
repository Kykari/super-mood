"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenSquare, BookOpen, BarChart, User } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/"
  ) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      name: "Главная",
      href: "/home",
      icon: Home,
    },
    {
      name: "Создать",
      href: "/stories/create",
      icon: PenSquare,
    },
    {
      name: "История",
      href: "/stories",
      icon: BookOpen,
    },
    {
      name: "Аналитика",
      href: "/analytics",
      icon: BarChart,
    },
    {
      name: "Профиль",
      href: "auth/profile",
      icon: User,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 lg:hidden">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? "text-[#7F1D1D] dark:text-[#f87171]"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span
                className={`text-xs font-medium ${
                  active ? "opacity-100" : "opacity-70"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
