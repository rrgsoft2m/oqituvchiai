"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Download, FileText, Printer, X } from "lucide-react";
import { ResultTabs } from "@/components/ResultTabs";
import { motion } from "framer-motion";
export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/history");
                setHistory(res.data.history);
            } catch (err) {
                console.error("Xatolik tarixni olishda:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        if (typeof window !== "undefined") {
            const html2pdf = (await import("html2pdf.js" as any)).default;
            const element = document.getElementById("pdf-content");
            if (element) {
                const opt = {
                    margin: 10,
                    filename: 'oqituvchi-ai.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(element).save();
            }
        }
    };
    if (loading) return <div className="text-center mt-20 text-gray-500">Tarix yuklanmoqda...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {selectedItem && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden relative">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-2xl font-bold">{selectedItem.topic}</h3>
                                <p className="text-sm text-gray-500">{selectedItem.subject} • {selectedItem.class}-sinf</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={handleDownload} className="flex gap-2 items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                                    <Download size={18} /> PDF yuklash
                                </button>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-200 rounded-full transition">
                                    <X size={24} className="text-gray-500 hover:text-red-500" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-8" id="pdf-content">
                            <ResultTabs result={selectedItem.content} reset={() => setSelectedItem(null)} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-800">Tarix 📚</h2>
                <div className="flex gap-3">
                    <button onClick={handleDownload} className="flex gap-2 items-center px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition whitespace-nowrap">
                        <Download size={18} /> PDF yuklash
                    </button>
                    <button onClick={handlePrint} className="flex gap-2 items-center px-4 py-2 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition">
                        <Printer size={18} /> Chop etish
                    </button>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="bg-white/80 p-10 rounded-3xl text-center shadow border-dashed border-2 border-gray-200">
                    <FileText size={48} className="mx-auto mt-4 text-gray-300 mb-4" />
                    <p className="text-gray-500">Hozircha hech qanday kontent yaratmadingiz.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={item.id}
                            className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {item.subject}
                                </span>
                                <span className="text-gray-400 text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-xl text-gray-800 mb-1">{item.topic}</h3>
                            <p className="text-sm text-gray-500 mb-6">{item.class}-sinf • {item.language} tili</p>

                            <div className="flex flex-wrap gap-2">
                                {Object.keys(item.content).map(k => (
                                    <span key={k} className="bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-xs text-gray-500 font-medium capitalize">
                                        {k}
                                    </span>
                                ))}
                            </div>

                            <button onClick={() => setSelectedItem(item)} className="mt-6 w-full py-2 bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-semibold rounded-xl border border-gray-100 transition">
                                Ko'rish
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
