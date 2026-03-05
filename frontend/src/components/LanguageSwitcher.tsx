"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FLAGS: Record<Locale, string> = {
    uz: "🇺🇿",
    ru: "🇷🇺",
    en: "🇬🇧",
};

const LABELS: Record<Locale, string> = {
    uz: "O'zbekcha",
    ru: "Русский",
    en: "English",
};

export function LanguageSwitcher({ variant = "full" }: { variant?: "full" | "compact" }) {
    const { locale, setLocale } = useLanguageStore();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-gray-200 shadow-sm transition-all text-sm font-medium"
                id="language-switcher"
            >
                <span className="text-lg">{FLAGS[locale]}</span>
                {variant === "full" && <span className="text-gray-700">{LABELS[locale]}</span>}
                <Globe size={14} className="text-gray-400" />
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[160px] animate-in fade-in slide-in-from-top-2">
                    {(["uz", "ru", "en"] as Locale[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => { setLocale(l); setOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-indigo-50 ${locale === l ? "bg-indigo-50 text-indigo-700" : "text-gray-700"}`}
                        >
                            <span className="text-lg">{FLAGS[l]}</span>
                            <span>{LABELS[l]}</span>
                            {locale === l && <span className="ml-auto text-indigo-500">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
