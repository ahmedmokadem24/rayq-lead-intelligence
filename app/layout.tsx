import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "RAYQ Lead Intelligence",
  description: "Internal lead generation and lead intelligence dashboard for RAYQ Marketing Agency."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell lg:flex">
          <Sidebar />
          <main className="main-shell">{children}</main>
        </div>
      </body>
    </html>
  );
}
