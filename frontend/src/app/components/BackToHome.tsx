"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function BackToHomeButton() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hideOnPages = ["/home", "/auth/login", "/auth/register"];

  if (isMobile || hideOnPages.includes(pathname)) {
    return null;
  }

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8">
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>На главную</span>
      </Link>
    </div>
  );
}
