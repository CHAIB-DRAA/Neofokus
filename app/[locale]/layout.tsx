import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import ProfileGate from "@/components/profile/ProfileGate";
import "../globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const isRtl = locale === "ar";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <body className="min-h-screen bg-[#F8F6F0]">
        <NextIntlClientProvider messages={messages}>
          <NavBar />
          <main className="max-w-2xl mx-auto px-4 py-6">
            <ProfileGate>{children}</ProfileGate>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
