"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import MobileBottomNav from "./components/MobileBottomNav";
import { Toaster } from "react-hot-toast";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const noLayoutPages = ["/auth/login", "/auth/register", "/admin"];
  const shouldHideLayout = noLayoutPages.includes(pathname);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/auth/profile`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const authenticated = res.ok;
      setIsAuthenticated(authenticated);

      const protectedPages = ["/home", "/stories", "/analytics", "/profile"];
      if (!authenticated && protectedPages.includes(pathname)) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    }
  };

  if (
    isAuthenticated === null &&
    ["/home", "/stories", "/analytics", "/profile"].includes(pathname)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F1D1D]"></div>
      </div>
    );
  }

  // На мобилках скрываем хедер и футер, показываем только нижнее меню
  if (isMobile && !shouldHideLayout) {
    return (
      <>
        <main className="pb-20">{children}</main>
        <MobileBottomNav />
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

  return (
    <>
      {shouldHideLayout ? (
        <>{children}</>
      ) : (
        <>
          <Header />
          <main className="flex-1">{children}</main>
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
