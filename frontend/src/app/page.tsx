"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";

export default function Splash() {
  const router = useRouter();
  const { hydrate, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate(); // Load auth state from LS

    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        // try fetching user to see if token is valid on backend
        await api.get("/auth/me");
        router.push("/dashboard");
      } catch (err) {
        // if API fails, clear invalid local storage just in case
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
    };

    const timer = setTimeout(() => {
      setLoading(false);
      verifyToken();
    }, 1500);

    return () => clearTimeout(timer);
  }, [hydrate, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="https://buxedu.uz/static/images/logo.png"
              alt="O'qituvchi AI Logo"
              className="w-48 h-auto drop-shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.p
              className="mt-6 text-xl font-semibold text-indigo-900 tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              Yuklanmoqda...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
