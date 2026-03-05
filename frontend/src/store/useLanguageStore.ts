import { create } from "zustand";
import { Locale } from "@/lib/i18n";

interface LanguageState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    hydrate: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    locale: "uz",
    setLocale: (locale) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("app_locale", locale);
        }
        set({ locale });
    },
    hydrate: () => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("app_locale") as Locale | null;
            if (saved && ["uz", "ru", "en"].includes(saved)) {
                set({ locale: saved });
            }
        }
    },
}));
