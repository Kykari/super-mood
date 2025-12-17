import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import LayoutClient from "./layoutClient";

const ralewayFont = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "SUPER MOOD",
  description: "Следите за своим состоянием каждый день!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ralewayFont.variable} ${ralewayFont.className} antialiased`}
      >
        <ThemeProvider>
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
