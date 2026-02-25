"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { Home, History, LogOut, Menu, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, hydrate, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        hydrate();
        setMounted(true);
    }, [hydrate]);

    useEffect(() => {
        if (mounted && !user) {
            router.push("/login");
        }
    }, [mounted, user, router]);

    if (!mounted || !user) return <div className="h-screen w-full bg-slate-50 flex items-center justify-center">Yuklanmoqda...</div>;

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative top-0 left-0 h-full w-64 bg-white/95 md:bg-white/70 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-xl z-30 transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                    <img src="https://buxedu.uz/static/images/logo.png" className="w-10" />
                    <h1 className="font-bold text-xl text-indigo-900">O'qituvchi AI</h1>
                </div>

                <div className="flex-1 p-4 space-y-2 mt-4">
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === "/dashboard" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-indigo-50"}`}>
                        <Home size={20} /> <span className="font-medium">Generator</span>
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard/history" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === "/dashboard/history" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-indigo-50"}`}>
                        <History size={20} /> <span className="font-medium">Tarix</span>
                    </Link>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gradient-to-t from-gray-50 flex flex-col items-center">
                    <UserCircle size={40} className="text-gray-400 mb-2" />
                    <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-indigo-600 font-semibold mb-4 bg-indigo-100 px-3 py-1 rounded-full">{user.role} TARIF</p>

                    <button onClick={() => { logout(); router.push("/login"); }} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition text-sm">
                        <LogOut size={16} /> Chiqish
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-100/30">
                <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b">
                    <div className="flex items-center gap-2">
                        <img src="https://buxedu.uz/static/images/logo.png" className="w-8" />
                        <h1 className="font-bold text-lg text-indigo-900">O'qituvchi AI</h1>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600"><Menu size={24} /></button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
