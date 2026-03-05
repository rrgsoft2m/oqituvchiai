"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, ClipboardList, MessageCircleQuestion, Gamepad2, Grid, Puzzle, Package } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/i18n";
import {
    generateSlidesPdf,
    generateTestsPdf,
    generateQaPdf,
    generateGamePdf,
    generateCrosswordPdf,
    generatePuzzlePdf,
} from "@/lib/pdfGenerator";

interface PdfDownloadMenuProps {
    content: any;
    topic: string;
}

export function PdfDownloadMenu({ content, topic }: PdfDownloadMenuProps) {
    const { locale } = useLanguageStore();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const items = [
        {
            id: "slides",
            label: t(locale, "pdf.slides"),
            icon: FileText,
            color: "text-indigo-600",
            bg: "hover:bg-indigo-50",
            action: () => content?.slides && generateSlidesPdf(content.slides, topic, locale),
            disabled: !content?.slides,
        },
        {
            id: "tests",
            label: t(locale, "pdf.tests"),
            icon: ClipboardList,
            color: "text-green-600",
            bg: "hover:bg-green-50",
            action: () => content?.tests && generateTestsPdf(content.tests, topic, locale),
            disabled: !content?.tests,
        },
        {
            id: "qa",
            label: t(locale, "pdf.qa"),
            icon: MessageCircleQuestion,
            color: "text-yellow-600",
            bg: "hover:bg-yellow-50",
            action: () => content?.qa && generateQaPdf(content.qa, topic, locale),
            disabled: !content?.qa,
        },
        {
            id: "game",
            label: t(locale, "pdf.game"),
            icon: Gamepad2,
            color: "text-purple-600",
            bg: "hover:bg-purple-50",
            action: () => content?.game && generateGamePdf(content.game, topic, locale),
            disabled: !content?.game,
        },
        {
            id: "crossword",
            label: t(locale, "pdf.crossword"),
            icon: Grid,
            color: "text-pink-600",
            bg: "hover:bg-pink-50",
            action: () => content?.crossword && generateCrosswordPdf(content.crossword, topic, locale),
            disabled: !content?.crossword,
        },
        {
            id: "puzzle",
            label: t(locale, "pdf.puzzle"),
            icon: Puzzle,
            color: "text-red-600",
            bg: "hover:bg-red-50",
            action: () => content?.logicPuzzle && generatePuzzlePdf(content.logicPuzzle, topic, locale),
            disabled: !content?.logicPuzzle,
        },
    ];

    const handleDownloadAll = () => {
        items.forEach((item) => {
            if (!item.disabled) {
                setTimeout(() => item.action(), 500 * items.indexOf(item));
            }
        });
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex gap-2 items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
                id="pdf-download-menu"
            >
                <Download size={18} />
                {t(locale, "history.downloadPdf")}
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 min-w-[280px] animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(locale, "pdf.selectType")}</p>
                    </div>
                    <div className="p-1">
                        {items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { item.action(); setOpen(false); }}
                                    disabled={item.disabled}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition ${item.bg} ${item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    <Icon size={18} className={item.color} />
                                    <span className="text-gray-700">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                        <button
                            onClick={handleDownloadAll}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition shadow-md"
                        >
                            <Package size={18} />
                            {t(locale, "pdf.downloadAll")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
