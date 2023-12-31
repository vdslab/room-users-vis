import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Header } from "@/components/layouts/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Room-User-Vis",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <section>
            <Header />
            {children}
          </section>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
