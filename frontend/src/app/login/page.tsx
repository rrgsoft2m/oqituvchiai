"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Login() {
    const router = useRouter();
    const loginFn = useAuthStore((state) => state.login);
    const { locale, hydrate: hydrateLocale } = useLanguageStore();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        hydrateLocale();
    }, [hydrateLocale]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/login", { login, password });
            loginFn(res.data.user, res.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || t(locale, "app.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4 relative">
            {/* Language switcher in top right */}
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher variant="full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50"
            >
                <div className="text-center mb-8">
                    <img src="https://buxedu.uz/static/images/logo.png" className="w-24 mx-auto mb-4 drop-shadow-md" />
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{t(locale, "login.title")}</h2>
                    <p className="text-gray-500 mt-2">{t(locale, "login.subtitle")}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t(locale, "login.username")}</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder={t(locale, "login.usernamePlaceholder")}
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t(locale, "login.password")}</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder={t(locale, "login.passwordPlaceholder")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform transform active:scale-95 flex justify-center items-center"
                    >
                        {loading ? t(locale, "login.loading") : t(locale, "login.submit")}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    {t(locale, "login.noAccount")}{" "}
                    <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
                        {t(locale, "login.register")}
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
