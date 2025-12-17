"use client";
import { useTheme } from "../contexts/ThemeContext";

interface ThemeCardProps {
  title: string;
  theme: "light" | "dark";
  gradient: string;
  description: string;
}

export default function ThemeCard({
  title,
  theme,
  gradient,
  description,
}: ThemeCardProps) {
  const { setTheme, isDark } = useTheme();

  const handleClick = () => {
    setTimeout(() => {
      setTheme(theme);
    }, 150);
  };

  const isActive =
    (theme === "dark" && isDark) || (theme === "light" && !isDark);

  return (
    <div
      onClick={handleClick}
      className={`
        relative group cursor-pointer rounded-3xl p-8 min-h-80
        bg-gradient-to-br ${gradient}
        transition-all duration-500 ease-in-out
        transform hover:scale-105 hover:shadow-3xl
        ${
          isActive
            ? "ring-4 ring-white/50 shadow-3xl scale-105"
            : "ring-2 ring-white/20 shadow-2xl"
        }
        overflow-hidden
      `}
    >
      {/* Эффект наведения */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>

      {/* Контент */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/80 text-lg">{description}</p>
        </div>

        {/* Индикатор активности */}
        <div className="flex items-center justify-between">
          <div
            className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isActive ? "bg-white/20" : "bg-white/10"
            }`}
          >
            <span className="text-white text-sm font-medium">
              {isActive ? "✓ Активно" : "Выбрать"}
            </span>
          </div>

          {isActive && (
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}
