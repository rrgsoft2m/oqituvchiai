"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
    const router = useRouter();
    const loginFn = useAuthStore((state) => state.login);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/login", { login, password });
            loginFn(res.data.user, res.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50"
            >
                <div className="text-center mb-8">
                    <img src="https://buxedu.uz/static/images/logo.png" className="w-24 mx-auto mb-4 drop-shadow-md" />
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Xush kelibsiz!</h2>
                    <p className="text-gray-500 mt-2">Dasturga kirish uchun ma'lumotlarni kiriting</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Loginni kiriting"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Parolni kiriting"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform transform active:scale-95 flex justify-center items-center"
                    >
                        {loading ? "Kirilmoqda..." : "Kirish"}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Hisobingiz yo'qmi?{" "}
                    <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
                        Ro'yxatdan o'tish
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
