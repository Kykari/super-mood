// app/components/BackToHomeButton.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackToHomeButton() {
  const pathname = usePathname();

  const hideOnPages = ["/home", "/auth/login", "/auth/register", "/"];
  if (hideOnPages.includes(pathname)) {
    return null;
  }

  return (
    <div className="pt-12 sm:pt-16 px-6 sm:px-8 lg:px-10">
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>На главную</span>
      </Link>
    </div>
  );
}
