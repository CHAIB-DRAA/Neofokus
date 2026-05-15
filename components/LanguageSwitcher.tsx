"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";
import { routing } from "@/lib/routing";

const LANG_LABELS: Record<string, string> = {
  fr: "FR",
  en: "EN",
  ar: "ع",
  es: "ES",
};

const LANG_NAMES: Record<string, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
  es: "Español",
};

export default function LanguageSwitcher() {
  const t = useTranslations("langSwitch");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#4A5568] hover:border-[#5B9CF6] transition-colors"
      >
        <Globe size={13} />
        <span>{LANG_LABELS[locale] ?? locale.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-100 rounded-2xl shadow-lg py-1 min-w-[120px]"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            {routing.locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors text-left ${
                  l === locale ? "text-[#5B9CF6] bg-[#EFF6FF]" : "text-[#4A5568] hover:bg-[#F8F6F0]"
                }`}
                dir={l === "ar" ? "rtl" : "ltr"}
              >
                <span className="font-bold text-xs w-5 text-center">{LANG_LABELS[l]}</span>
                <span>{LANG_NAMES[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
