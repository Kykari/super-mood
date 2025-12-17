import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 theme-transition relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h1 className="text-white font-black text-xl mb-4">О нас</h1>
            <div className="space-y-3">
              <Link href="/politics">
                <p className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 cursor-pointer">
                  Политика конфиденциальности
                </p>
              </Link>
              <Link href="/about">
                <p className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 cursor-pointer">
                  Про SuperMood
                </p>
              </Link>
            </div>
          </div>

          {/* <div>
            <h1 className="text-white font-black text-xl mb-4">Контакты</h1>
            <div className="space-y-3">
              <Link href="/about/form">
                <p className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 cursor-pointer">
                  Форма обратной связи
                </p>
              </Link>
            </div>
          </div> */}

          <div className="flex flex-col items-start md:items-end">
            <div className="flex gap-4 mb-6">
              <Link
                href="https://t.me/Todorokas"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              >
                <Image
                  src="/tg.svg"
                  alt="телеграмм"
                  width={32}
                  height={32}
                  className="transition-all"
                />
              </Link>
              <Link
                href="https://wa.me/79992334560"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              >
                <Image
                  src="/ws.svg"
                  alt="ватсап"
                  width={32}
                  height={32}
                  className="transition-all"
                />
              </Link>
            </div>
            <p className="text-gray-300 text-lg">SuperMood©2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
