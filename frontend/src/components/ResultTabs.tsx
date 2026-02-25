"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Presentation, ClipboardList, MessageCircleQuestion, Gamepad2, Puzzle, Grid } from "lucide-react";

export function ResultTabs({ result, reset }: { result: any, reset: () => void }) {
    const [activeTab, setActiveTab] = useState("slides");

    const TABS = [
        { id: "slides", label: "Slaydlar", icon: Presentation, color: "text-indigo-500", bg: "bg-indigo-50" },
        { id: "tests", label: "Testlar", icon: ClipboardList, color: "text-green-500", bg: "bg-green-50" },
        { id: "qa", label: "S&A", icon: MessageCircleQuestion, color: "text-yellow-500", bg: "bg-yellow-50" },
        { id: "game", label: "O'yin", icon: Gamepad2, color: "text-purple-500", bg: "bg-purple-50" },
        { id: "crossword", label: "Krossvord", icon: Grid, color: "text-pink-500", bg: "bg-pink-50" },
        { id: "logic", label: "Jumboq", icon: Puzzle, color: "text-red-500", bg: "bg-red-50" },
    ];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">

            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white">
                <div>
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Natijalar tayyor! 🚀</h2>
                    <p className="text-sm text-gray-500 mt-1">Siz tanlagan mavzu bo'yicha barcha modullar shakllantirildi.</p>
                </div>
                <button onClick={reset} className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-bold rounded-xl shadow-inner transition transform active:scale-95">
                    Qayta Yaratish
                </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
                {TABS.map(t => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === t.id ? `${t.bg} shadow-md border border-white` : "bg-white hover:bg-gray-50 text-gray-500 shadow-sm"}`}
                        >
                            <Icon size={20} className={activeTab === t.id ? t.color : "text-gray-400"} />
                            <span className={activeTab === t.id ? t.color : ""}>{t.label}</span>
                        </button>
                    )
                })}
            </div>

            <div className="bg-white/80 backdrop-blur-md min-h-[500px] rounded-3xl p-8 shadow-xl border border-white relative overflow-hidden">
                {activeTab === "slides" && <SlideView slides={result.slides} />}
                {activeTab === "tests" && <TestView tests={result.tests} />}
                {activeTab === "qa" && <QaView qa={result.qa} />}
                {activeTab === "game" && <GameView game={result.game} />}
                {activeTab === "crossword" && <CrosswordView crosswords={result.crossword} />}
                {activeTab === "logic" && <LogicView logic={result.logicPuzzle} />}
            </div>

        </motion.div>
    );
}

function SlideView({ slides }: { slides: any[] }) {
    const [idx, setIdx] = useState(0);
    if (!slides || !slides.length) return <div className="text-gray-400 text-center mt-20 font-medium">Slayd topilmadi</div>;
    const slide = slides[idx];
    return (
        <div className="flex flex-col h-full bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl">
            <div className="flex-1 p-8 flex flex-col justify-center items-center text-center space-y-6 overflow-y-auto">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl border-[6px] border-white relative shrink-0">
                    <img
                        src={slide.imageKeyword ? `https://tse1.mm.bing.net/th?q=${encodeURIComponent(slide.imageKeyword + ' desktop wallpaper')}&w=1200&h=600&c=7&rs=1&p=0` : `https://tse1.mm.bing.net/th?q=education+school+background&w=1200&h=600&c=7`}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = `https://tse1.mm.bing.net/th?q=blank+background&w=1200&h=600&c=7`; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md text-left">{slide.title}</h1>
                    </div>
                </motion.div>

                <ul className="text-left space-y-4 max-w-4xl mt-6 w-full">
                    {slide.points?.map((p: string, i: number) => (
                        <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white"><span className="text-indigo-500 font-bold">•</span><span className="text-lg font-medium text-gray-800">{p}</span></motion.li>
                    ))}
                </ul>
            </div>
            <div className="p-4 bg-white/40 border-t border-white flex justify-between items-center px-10">
                <button onClick={() => setIdx(Math.max(0, idx - 1))} className="px-5 py-2 hover:bg-white rounded-lg font-bold text-indigo-600 transition shadow-sm border border-transparent hover:border-indigo-100 disabled:opacity-50" disabled={idx === 0}>Avvalgi</button>
                <span className="font-bold text-gray-500 bg-white px-4 py-1 rounded-full shadow-inner">{idx + 1} / {slides.length}</span>
                <button onClick={() => setIdx(Math.min(slides.length - 1, idx + 1))} className="px-5 py-2 hover:bg-white rounded-lg font-bold text-indigo-600 transition shadow-sm border border-transparent hover:border-indigo-100 disabled:opacity-50" disabled={idx === slides.length - 1}>Keyingi</button>
            </div>
        </div>
    );
}

function TestView({ tests }: { tests: any[] }) {
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);

    if (!tests) return <div>Yo'q</div>;

    const handleSelect = (qIdx: number, aIdx: number) => {
        if (!submitted) {
            setUserAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
        }
    };

    const calculateScore = () => {
        let correct = 0;
        tests.forEach((t, i) => {
            if (userAnswers[i] === t.answerIndex) correct++;
        });
        return { correct, total: tests.length, percent: Math.round((correct / tests.length) * 100) };
    };

    const score = submitted ? calculateScore() : null;

    return (
        <div className="space-y-8 max-h-[600px] overflow-auto pr-4 custom-scrollbar">
            {submitted && score && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-1">Testingiz natijasi</h3>
                        <p className="text-green-100">{score.correct} ta to'g'ri, {score.total - score.correct} ta noto'g'ri</p>
                    </div>
                    <div className="text-5xl font-black bg-white text-green-600 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">
                        {score.percent}%
                    </div>
                </div>
            )}

            {tests.map((t, i) => (
                <div key={i} className={`bg-green-50/50 p-6 rounded-2xl border ${submitted && userAnswers[i] === t.answerIndex ? 'border-green-400 bg-green-100/50' : submitted && userAnswers[i] !== t.answerIndex ? 'border-red-400 bg-red-50/50' : 'border-green-100'}`}>
                    <h3 className="font-bold text-xl text-green-900 mb-6 flex gap-3"><span className="bg-green-200 text-green-800 w-8 h-8 flex items-center justify-center rounded-full text-sm shrink-0">{i + 1}</span> {t.question}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                        {t.options.map((opt: string, j: number) => {
                            const isSelected = userAnswers[i] === j;
                            const isCorrect = submitted && j === t.answerIndex;
                            const isWrongSelection = submitted && isSelected && j !== t.answerIndex;

                            return (
                                <div
                                    key={j}
                                    onClick={() => handleSelect(i, j)}
                                    className={`p-4 rounded-xl border-2 shadow-sm flex gap-3 font-medium transition cursor-pointer ${isSelected && !submitted ? 'border-green-500 bg-green-50' :
                                        isCorrect ? 'border-green-500 bg-green-100 text-green-900' :
                                            isWrongSelection ? 'border-red-500 bg-red-100 text-red-900' :
                                                'border-gray-100 bg-white hover:border-green-300 text-gray-700'
                                        }`}
                                >
                                    <span className={`font-bold ${isCorrect ? 'text-green-700' : isWrongSelection ? 'text-red-700' : 'text-green-500'}`}>{['A', 'B', 'C', 'D'][j]})</span> {opt}
                                </div>
                            );
                        })}
                    </div>
                    {submitted && userAnswers[i] !== t.answerIndex && (
                        <div className="mt-4 ml-11 pt-4 border-t border-red-200 text-red-600 font-medium">To'g'ri javob: <span className="font-bold">{['A', 'B', 'C', 'D'][t.answerIndex]}) {t.options[t.answerIndex]}</span></div>
                    )}
                </div>
            ))}

            {!submitted && (
                <button
                    onClick={() => setSubmitted(true)}
                    disabled={Object.keys(userAnswers).length !== tests.length}
                    className="w-full py-4 text-xl font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl shadow-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Natijani Ko'rish
                </button>
            )}
        </div>
    )
}

function QaView({ qa }: { qa: any[] }) {
    if (!qa) return <div>Yo'q</div>;
    return (
        <div className="space-y-4 max-h-[600px] overflow-auto pr-4 custom-scrollbar">
            {qa.map((q, i) => (
                <details key={i} className="bg-yellow-50/50 rounded-2xl border border-yellow-100 group [&_summary::-webkit-details-marker]:hidden">
                    <summary className="font-bold text-lg text-yellow-900 p-6 cursor-pointer flex justify-between items-center group-open:border-b border-yellow-200">
                        <span className="flex gap-3"><span className="bg-yellow-200 text-yellow-800 w-8 h-8 flex items-center justify-center rounded-full text-sm shrink-0 font-bold">{i + 1}</span> {q.question}</span>
                        <span className="text-yellow-500 transform group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-6 bg-white/60 leading-relaxed font-medium text-gray-700 flex gap-3">
                        <span className="text-green-500 font-extrabold pb-4 border-b-2 border-transparent"></span> {q.answer}
                    </div>
                </details>
            ))}
        </div>
    )
}

function GameView({ game }: { game: any }) {
    if (!game) return <div>Yo'q</div>;
    return (
        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-8 rounded-3xl border border-purple-100 h-full max-h-[600px] overflow-auto">
            <h2 className="text-3xl font-black text-purple-900 mb-6 flex items-center gap-3"><Gamepad2 className="text-purple-500 w-10 h-10" /> Interaktiv O'yin</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/80 p-6 rounded-2xl shadow-sm">
                    <h4 className="font-bold text-purple-600 uppercase text-sm tracking-wider mb-2">Ssenariy</h4>
                    <p className="font-medium text-gray-800 text-lg">{game.scenario}</p>
                </div>
                <div className="bg-white/80 p-6 rounded-2xl shadow-sm">
                    <h4 className="font-bold text-purple-600 uppercase text-sm tracking-wider mb-2">Qoidalar</h4>
                    <p className="font-medium text-gray-800">{game.rules}</p>
                </div>
            </div>
            <div className="bg-white/80 p-6 rounded-2xl shadow-sm mb-6">
                <h4 className="font-bold text-purple-600 uppercase text-sm tracking-wider mb-2">Kerakli Jihozlar</h4>
                <p className="font-medium text-gray-800">{game.equipment}</p>
            </div>
            <div className="bg-white/80 p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold text-purple-600 uppercase text-sm tracking-wider mb-4">Qadamlar</h4>
                <ul className="space-y-4">
                    {game.steps?.map((s: string, i: number) => (
                        <li key={i} className="flex gap-4 items-center bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <span className="bg-purple-200 text-purple-800 font-bold w-8 h-8 flex items-center justify-center rounded-xl">{i + 1}</span>
                            <span className="font-medium">{s}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

function CrosswordView({ crosswords }: { crosswords: any[] }) {
    if (!crosswords) return <div>Yo'q</div>;
    return (
        <div className="bg-pink-50 p-8 rounded-3xl border border-pink-100 h-full min-h-[400px]">
            <h2 className="text-3xl font-black text-pink-900 mb-8 flex items-center gap-3"><Grid className="text-pink-500 w-10 h-10" /> Krossvord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {crosswords.map((c, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 flex flex-col justify-between">
                        <p className="font-bold text-lg text-gray-800 mb-4 flex gap-3"><span className="text-pink-500">{i + 1}.</span> {c.clue}</p>
                        <div className="flex gap-1">
                            {c.word.split('').map((char: string, j: number) => (
                                <div key={j} className="w-10 h-10 border-2 border-pink-300 rounded-lg flex items-center justify-center font-bold text-xl text-pink-700 bg-pink-50 shadow-inner uppercase">
                                    {char}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function LogicView({ logic }: { logic: any }) {
    const [show, setShow] = useState(false);
    if (!logic) return <div>Yo'q</div>;
    return (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-10 rounded-3xl border border-red-100 min-h-[400px] flex flex-col items-center justify-center text-center">
            <Puzzle className="w-16 h-16 text-red-500 mb-6 drop-shadow-md" />
            <h3 className="text-3xl md:text-4xl font-black text-red-900 mb-8 max-w-2xl leading-relaxed">
                "{logic.puzzle}"
            </h3>
            <button
                onClick={() => setShow(!show)}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-lg mb-8"
            >
                {show ? "Javobni yashirish" : "Javobni ko'rish"}
            </button>
            {show && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-white px-8 py-6 rounded-2xl shadow-xl border-t-4 border-red-500">
                    <p className="text-2xl font-bold text-gray-800">{logic.answer}</p>
                </motion.div>
            )}
        </div>
    )
}
