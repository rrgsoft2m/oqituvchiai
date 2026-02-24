"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { BrainCircuit, BookOpen, Layers, Type } from "lucide-react";

const SUBJECTS = [
    "Adabiyot", "Algebra", "Alifbe", "Astranomiya", "Biologiya", "Botanika", "Fizika",
    "Geografiya", "Geometriya", "Informatika va AT", "Ingliz tili", "Jahon tarixi",
    "Kimyo", "Matematika", "Ona tili", "O‘zbekiston tarixi", "Rus tili", "Tarix"
];

import { ResultTabs } from "@/components/ResultTabs";

export default function Dashboard() {
    const [subject, setSubject] = useState("Matematika");
    const [classLevel, setClassLevel] = useState("5");
    const [language, setLanguage] = useState("uz");
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await api.post("/generate", { subject, classLevel, language, topic });
            setResult(res.data.generation.content);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">

            {!result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-xl border border-white/60">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                            <BrainCircuit className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-800">Yangi Dars Yaratish</h2>
                            <p className="text-gray-500 mt-1">Sun'iy intellekt yordamida super kontent generasiyalang.</p>
                        </div>
                    </div>

                    <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <BookOpen size={16} className="text-indigo-500" /> Fan
                            </label>
                            <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-slate-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-gray-800 transition shadow-sm">
                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Layers size={16} className="text-purple-500" /> Sinf
                            </label>
                            <select value={classLevel} onChange={e => setClassLevel(e.target.value)} className="w-full bg-slate-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 text-gray-800 transition shadow-sm">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => <option key={n} value={n}>{n}-sinf</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Type size={16} className="text-pink-500" /> Til
                            </label>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-slate-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-pink-500 rounded-xl px-4 py-3 text-gray-800 transition shadow-sm">
                                <option value="uz">O'zbek tili</option>
                                <option value="ru">Rus tili</option>
                                <option value="en">Ingliz tili</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2 mt-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                Mavzu nomi
                            </label>
                            <input
                                required
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                type="text"
                                placeholder="Masalan: Nyutonning 1-qonuni, Yerdagi suv aylanishi..."
                                className="w-full bg-slate-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl px-5 py-4 text-gray-800 text-lg transition shadow-sm"
                            />
                        </div>

                        {error && <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">{error}</div>}

                        <div className="md:col-span-2 pt-4">
                            <button
                                disabled={loading}
                                className="w-full py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none flex justify-center items-center gap-3 relative overflow-hidden group"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Yaratilmoqda... Qahva ichib turing ☕
                                    </span>
                                ) : (
                                    <>
                                        <span className="relative z-10">YARATISH</span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <ResultTabs result={result} reset={() => setResult(null)} />
            )}
        </div>
    );
}
