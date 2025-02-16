import AuthProvider from "@/components/providers/AuthProvider";
import { Providers } from "@/hooks/providers";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Modern admin panel template",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
