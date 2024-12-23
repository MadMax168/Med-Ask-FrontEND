import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import localFont from "next/font/local";
import "./globals.css";
import { Inter, Kanit, Mitr } from "next/font/google";

const mitr = Kanit({ weight: "300", subsets: ["thai"] });

const fcVisionRounded = localFont({
  src: "./fonts/FC Vision Rounded.otf",
  variable: "--font-fc-vision-rounded",
  weight: "100 200",
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {

  title: "MEDASK",
  description: "Mali Chatbot for electronics health data extraction",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <SidebarProvider className="overflow-hidden">
          <AppSidebar />
          <main className={mitr.className}>
            <SidebarTrigger className="absolute" />
            <div className="radial-glow -top-[10rem] right-[25rem]"></div>
            <div className="radial-glow -bottom-[7rem] left-0"></div>
            <div className="radial-glow bottom-0 right-0"></div>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
