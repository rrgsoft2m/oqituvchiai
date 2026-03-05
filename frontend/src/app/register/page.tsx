"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/i18n";
import { CheckCircle2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Register() {
    const router = useRouter();
    const loginFn = useAuthStore((state) => state.login);
    const { locale, hydrate: hydrateLocale } = useLanguageStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedPlan, setSelectedPlan] = useState("FREE");

    useEffect(() => {
        hydrateLocale();
    }, [hydrateLocale]);

    const SUBSCRIPTIONS = [
        { id: "FREE", name: t(locale, "register.free"), price: t(locale, "register.free.price"), period: t(locale, "register.period"), features: [t(locale, "register.free.f1"), t(locale, "register.free.f2"), t(locale, "register.free.f3"), t(locale, "register.free.f4")], color: "from-green-400 to-emerald-500" },
        { id: "USTOZ", name: t(locale, "register.ustoz"), price: t(locale, "register.ustoz.price"), period: t(locale, "register.period"), features: [t(locale, "register.ustoz.f1"), t(locale, "register.ustoz.f2"), t(locale, "register.ustoz.f3"), t(locale, "register.ustoz.f4")], color: "from-blue-400 to-indigo-500", popular: true },
        { id: "KATTA_USTOZ", name: t(locale, "register.kattaUstoz"), price: t(locale, "register.kattaUstoz.price"), period: t(locale, "register.period"), features: [t(locale, "register.kattaUstoz.f1"), t(locale, "register.kattaUstoz.f2"), t(locale, "register.kattaUstoz.f3"), t(locale, "register.kattaUstoz.f4")], color: "from-purple-500 to-pink-500" },
    ];

    // Form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/register", { firstName, lastName, login, password, role: selectedPlan });
            loginFn(res.data.user, res.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || t(locale, "app.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center justify-center relative">
            {/* Language switcher */}
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher variant="full" />
            </div>

            <div className="w-full max-w-5xl mx-auto">

                {/* Progress header */}
                <div className="flex justify-center mb-10 text-center">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md ${step === 1 ? 'bg-indigo-600 text-white border-4 border-indigo-200' : 'bg-green-500 text-white'}`}>
                            {step === 2 ? <CheckCircle2 size={20} /> : "1"}
                        </div>
                        <div className={`h-1 w-16 md:w-32 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md ${step === 2 ? 'bg-indigo-600 text-white border-4 border-indigo-200' : 'bg-white text-gray-500'}`}>
                            2
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-4xl font-extrabold text-slate-900">{t(locale, "register.selectPlan")}</h1>
                                <p className="text-gray-500 mt-2 text-lg">{t(locale, "register.selectPlanDesc")}</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {SUBSCRIPTIONS.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative cursor-pointer transition-all duration-300 transform rounded-3xl p-1 bg-gradient-to-br ${plan.color} shadow-xl hover:scale-105 ${selectedPlan === plan.id ? 'ring-4 ring-offset-4 ring-indigo-500 scale-105' : 'opacity-90 hover:opacity-100'}`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                {t(locale, "register.popular")}
                                            </div>
                                        )}
                                        <div className="bg-white/95 backdrop-blur-sm rounded-[22px] h-full p-6 flex flex-col">
                                            <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                                            <div className="my-4">
                                                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                                <span className="text-gray-500 ml-1">/{plan.period}</span>
                                            </div>
                                            <ul className="space-y-3 flex-1 mt-4">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center text-gray-700">
                                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                                                        <span className="text-sm font-medium">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                className={`mt-8 w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${plan.color} hover:shadow-lg transition-all`}
                                                onClick={() => { setSelectedPlan(plan.id); setStep(2); }}
                                            >
                                                {t(locale, "register.select")}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-6 text-gray-500 font-medium">
                                {t(locale, "register.hasAccount")} <Link href="/login" className="text-indigo-600 hover:underline">{t(locale, "register.login")}</Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="max-w-md mx-auto"
                        >
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold mb-2">{t(locale, "register.personalInfo")}</h2>
                                    <p className="text-sm text-gray-500">
                                        {t(locale, "register.selectedPlan", { plan: SUBSCRIPTIONS.find(s => s.id === selectedPlan)?.name || "" })}
                                    </p>
                                </div>

                                <form onSubmit={handleRegister} className="space-y-4">
                                    {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t(locale, "register.firstName")}</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={firstName} onChange={e => setFirstName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t(locale, "register.lastName")}</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={lastName} onChange={e => setLastName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t(locale, "login.username")}</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={login} onChange={e => setLogin(e.target.value)} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t(locale, "login.password")}</label>
                                        <input required type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">{t(locale, "register.back")}</button>
                                        <button disabled={loading} type="submit" className="w-2/3 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg disabled:opacity-70 transition-all">
                                            {loading ? t(locale, "register.submitting") : t(locale, "register.submit")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
