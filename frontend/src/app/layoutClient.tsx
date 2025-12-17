"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const noLayoutPages = ["/auth/login", "/auth/register", "/admin"];
  const shouldHideLayout = noLayoutPages.includes(pathname);

  // Страницы, требующие аутентификации
  const protectedPages = [
    "/",
    "/stories",
    "/stories/create",
    "/analytics",
    "/profile",
  ];

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      // Проверка аутентификации (~строка 33):
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/auth/profile`,
        {
          credentials: "include",
          cache: "no-store", // Важно!
        }
      );

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);

        // Если пользователь не авторизован и пытается зайти на защищенную страницу
        if (protectedPages.includes(pathname)) {
          router.push("/auth/login");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);

      if (protectedPages.includes(pathname)) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Показываем лоадер во время проверки
  if (loading && protectedPages.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F1D1D]"></div>
      </div>
    );
  }

  // Если не авторизован и на защищенной странице - ничего не показываем (будет редирект)
  if (!isAuthenticated && protectedPages.includes(pathname)) {
    return null;
  }

  return (
    <>
      {shouldHideLayout ? (
        <>{children}</>
      ) : (
        <>
          <Header />
          <main className="pt-16">
            {" "}
            {/* Добавлен отступ для хедера */}
            {children}
          </main>
          <Footer />
        </>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "rgb(31 41 55)",
            color: "#fff",
            borderRadius: "16px",
            padding: "16px 24px",
            fontSize: "16px",
          },
          success: { style: { background: "rgb(34 197 94)" } },
          error: { style: { background: "rgb(239 68 68)" } },
        }}
      />
    </>
  );
}
