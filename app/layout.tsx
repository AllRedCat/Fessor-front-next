import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { AuthProvider } from "@/app/providers/auth-provider";
import { SidebarProvider } from "@/app/providers/sidebar-provider";
import Navigation from "@/app/components/navigation";
import PageWrapper from "@/app/components/page-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fessor - Plataforma de Relatórios Escolares",
  description: "Sistema para geração de relatórios escolares com IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <main>
                  <PageWrapper>
                    {children}
                  </PageWrapper>
                </main>
              </div>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
