import jsPDF from "jspdf";
import { Locale, t } from "@/lib/i18n";

// Helper to add a styled header to the PDF
function addHeader(doc: jsPDF, title: string, subtitle: string, pageW: number) {
    // Purple header bar
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.rect(0, 0, pageW, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(title, 15, 20);
    doc.setFontSize(11);
    doc.text(subtitle, 15, 32);
    doc.setTextColor(0, 0, 0);
}

function addFooter(doc: jsPDF, locale: Locale, pageNum: number, totalPages: number, pageW: number, pageH: number) {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageH - 15, pageW, 15, "F");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${t(locale, "pdf.page")} ${pageNum} / ${totalPages}`, pageW / 2, pageH - 6, { align: "center" });
    doc.text(t(locale, "app.name"), 15, pageH - 6);
    doc.setTextColor(0, 0, 0);
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
    return doc.splitTextToSize(text, maxWidth);
}

// ==================== SLIDES PDF ====================
export function generateSlidesPdf(slides: any[], topic: string, locale: Locale) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let totalPages = slides.length;

    slides.forEach((slide, idx) => {
        if (idx > 0) doc.addPage();

        addHeader(doc, topic, `${t(locale, "pdf.slide")} ${idx + 1} / ${slides.length}`, pageW);

        let y = 50;

        // slide title
        doc.setFontSize(18);
        doc.setTextColor(55, 48, 163); // indigo-800
        const titleLines = wrapText(doc, slide.title, contentW);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 8 + 5;

        // Decorative line
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageW - margin, y);
        y += 10;

        // Points
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59); // slate-800
        if (slide.points) {
            slide.points.forEach((point: string, pIdx: number) => {
                const bullet = `${pIdx + 1}. `;
                const lines = wrapText(doc, bullet + point, contentW - 5);

                if (y + lines.length * 6 > pageH - 25) {
                    addFooter(doc, locale, idx + 1, totalPages, pageW, pageH);
                    doc.addPage();
                    totalPages++;
                    y = 20;
                }

                // Bullet bg
                doc.setFillColor(238, 242, 255); // indigo-50
                doc.roundedRect(margin, y - 4, contentW, lines.length * 6 + 6, 2, 2, "F");

                doc.setTextColor(30, 41, 59);
                doc.text(lines, margin + 3, y + 2);
                y += lines.length * 6 + 10;
            });
        }

        addFooter(doc, locale, idx + 1, totalPages, pageW, pageH);
    });

    doc.save(`${topic}_taqdimot.pdf`);
}

// ==================== TESTS PDF ====================
export function generateTestsPdf(tests: any[], topic: string, locale: Locale) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let pageNum = 1;

    addHeader(doc, topic, `${t(locale, "pdf.tests").replace("📝 ", "")} - ${tests.length} ${t(locale, "pdf.question").toLowerCase()}`, pageW);

    let y = 50;

    tests.forEach((test, idx) => {
        const questionText = `${idx + 1}. ${test.question}`;
        const qLines = wrapText(doc, questionText, contentW);
        const optionHeight = test.options ? test.options.length * 8 : 0;
        const blockHeight = qLines.length * 6 + optionHeight + 20;

        if (y + blockHeight > pageH - 25) {
            addFooter(doc, locale, pageNum, 0, pageW, pageH);
            doc.addPage();
            pageNum++;
            y = 20;
        }

        // Question background
        doc.setFillColor(240, 253, 244); // green-50
        doc.roundedRect(margin, y - 4, contentW, blockHeight, 3, 3, "F");
        doc.setDrawColor(187, 247, 208); // green-200
        doc.roundedRect(margin, y - 4, contentW, blockHeight, 3, 3, "S");

        // Question number badge
        doc.setFillColor(34, 197, 94); // green-500
        doc.circle(margin + 6, y + 2, 4, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(String(idx + 1), margin + 6, y + 3.5, { align: "center" });

        // Question text
        doc.setTextColor(20, 83, 45); // green-900
        doc.setFontSize(12);
        doc.text(wrapText(doc, test.question, contentW - 20), margin + 14, y + 3);
        y += qLines.length * 6 + 6;

        // Options
        if (test.options) {
            doc.setFontSize(11);
            const letters = ["A", "B", "C", "D"];
            test.options.forEach((opt: string, j: number) => {
                doc.setTextColor(55, 65, 81); // gray-700
                doc.text(`   ${letters[j]}) ${opt}`, margin + 8, y + 2);
                y += 7;
            });
        }

        y += 8;
    });

    // Answer key on the last page
    doc.addPage();
    pageNum++;
    addHeader(doc, topic, `${t(locale, "pdf.correctAnswer2")}`, pageW);
    y = 55;

    doc.setFontSize(14);
    doc.setTextColor(55, 48, 163);
    doc.text(`${t(locale, "pdf.correctAnswer2")}:`, margin, y);
    y += 12;

    doc.setFontSize(12);
    const letters = ["A", "B", "C", "D"];
    tests.forEach((test, idx) => {
        if (y > pageH - 25) {
            doc.addPage();
            pageNum++;
            y = 20;
        }
        doc.setTextColor(30, 41, 59);
        const answerLetter = letters[test.answerIndex] || "?";
        const answerText = test.options?.[test.answerIndex] || "";
        doc.text(`${idx + 1}. ${answerLetter}) ${answerText}`, margin + 5, y);
        y += 8;
    });

    addFooter(doc, locale, pageNum, pageNum, pageW, pageH);
    doc.save(`${topic}_testlar.pdf`);
}

// ==================== Q&A PDF ====================
export function generateQaPdf(qa: any[], topic: string, locale: Locale) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let pageNum = 1;

    addHeader(doc, topic, `${t(locale, "pdf.qa").replace("❓ ", "")} - ${qa.length} ${t(locale, "pdf.question").toLowerCase()}`, pageW);

    let y = 55;

    qa.forEach((item, idx) => {
        const qLines = wrapText(doc, `${idx + 1}. ${item.question}`, contentW - 5);
        const aLines = wrapText(doc, item.answer, contentW - 10);
        const blockHeight = qLines.length * 6 + aLines.length * 6 + 18;

        if (y + blockHeight > pageH - 25) {
            addFooter(doc, locale, pageNum, 0, pageW, pageH);
            doc.addPage();
            pageNum++;
            y = 20;
        }

        // Question
        doc.setFillColor(254, 249, 195); // yellow-100
        doc.roundedRect(margin, y - 4, contentW, qLines.length * 6 + 6, 2, 2, "F");
        doc.setFontSize(12);
        doc.setTextColor(113, 63, 18); // yellow-900
        doc.text(qLines, margin + 3, y + 2);
        y += qLines.length * 6 + 8;

        // Answer
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin + 5, y - 4, contentW - 10, aLines.length * 6 + 6, 2, 2, "F");
        doc.setDrawColor(234, 179, 8); // yellow-500
        doc.setLineWidth(0.8);
        doc.line(margin + 5, y - 4, margin + 5, y + aLines.length * 6 + 2);
        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81);
        doc.text(aLines, margin + 10, y + 2);
        y += aLines.length * 6 + 14;
    });

    addFooter(doc, locale, pageNum, pageNum, pageW, pageH);
    doc.save(`${topic}_savol_javob.pdf`);
}

// ==================== GAME PDF ====================
export function generateGamePdf(game: any, topic: string, locale: Locale) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;

    addHeader(doc, topic, t(locale, "pdf.gameScenario"), pageW);

    let y = 55;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(88, 28, 135); // purple-900
    doc.text(`🎮 ${t(locale, "results.interactiveGame")}`, margin, y);
    y += 15;

    // Scenario
    doc.setFillColor(250, 245, 255); // purple-50
    doc.roundedRect(margin, y - 4, contentW, 0, 3, 3, "F"); // measure first
    doc.setFontSize(10);
    doc.setTextColor(88, 28, 135);
    doc.text(t(locale, "pdf.gameScenario").toUpperCase(), margin + 5, y + 2);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    const scenarioLines = wrapText(doc, game.scenario || "", contentW - 10);
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(margin, y - 6, contentW, scenarioLines.length * 6 + 10, 3, 3, "F");
    doc.text(scenarioLines, margin + 5, y + 2);
    y += scenarioLines.length * 6 + 16;

    // Rules
    doc.setFontSize(10);
    doc.setTextColor(88, 28, 135);
    doc.text(t(locale, "pdf.gameRules").toUpperCase(), margin + 5, y);
    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    const rulesLines = wrapText(doc, game.rules || "", contentW - 10);
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(margin, y - 6, contentW, rulesLines.length * 6 + 10, 3, 3, "F");
    doc.text(rulesLines, margin + 5, y + 2);
    y += rulesLines.length * 6 + 16;

    // Equipment
    doc.setFontSize(10);
    doc.setTextColor(88, 28, 135);
    doc.text(t(locale, "pdf.gameEquipment").toUpperCase(), margin + 5, y);
    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    const eqLines = wrapText(doc, game.equipment || "", contentW - 10);
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(margin, y - 6, contentW, eqLines.length * 6 + 10, 3, 3, "F");
    doc.text(eqLines, margin + 5, y + 2);
    y += eqLines.length * 6 + 16;

    // Steps
    if (game.steps && game.steps.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(88, 28, 135);
        doc.text(t(locale, "pdf.gameSteps").toUpperCase(), margin + 5, y);
        y += 8;

        game.steps.forEach((step: string, idx: number) => {
            if (y > pageH - 30) {
                doc.addPage();
                y = 20;
            }
            const stepLines = wrapText(doc, `${idx + 1}. ${step}`, contentW - 15);
            doc.setFillColor(245, 243, 255); // violet-50
            doc.roundedRect(margin + 5, y - 4, contentW - 10, stepLines.length * 6 + 6, 2, 2, "F");
            doc.setFontSize(11);
            doc.setTextColor(30, 41, 59);
            doc.text(stepLines, margin + 10, y + 2);
            y += stepLines.length * 6 + 8;
        });
    }

    addFooter(doc, locale, 1, 1, pageW, pageH);
    doc.save(`${topic}_oyin.pdf`);
}

// ==================== CROSSWORD PDF ====================
export function generateCrosswordPdf(crosswords: any[], topic: string, locale: Locale) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;

    addHeader(doc, topic, t(locale, "results.crossword"), pageW);

    let y = 55;

    doc.setFontSize(18);
    doc.setTextColor(190, 24, 93); // pink-700
    doc.text(`🔠 ${t(locale, "results.crossword")}`, margin, y);
    y += 15;

    // Draw crossword grid - each word gets its own row of boxes
    const cellSize = 10;

    crosswords.forEach((cw, idx) => {
        const word = cw.word || "";
        const clue = cw.clue || "";
        const wordWidth = word.length * cellSize + 30;

        if (y + 35 > pageH - 25) {
            doc.addPage();
            y = 20;
        }

        // Clue
        doc.setFontSize(11);
        doc.setTextColor(157, 23, 77); // pink-800
        const clueLines = wrapText(doc, `${idx + 1}. ${clue}`, contentW);
        doc.text(clueLines, margin + 3, y);
        y += clueLines.length * 6 + 4;

        // Word grid (empty cells for student to fill)
        const gridStartX = margin + 5;
        for (let i = 0; i < word.length; i++) {
            const x = gridStartX + i * (cellSize + 1);
            // Empty cell
            doc.setFillColor(255, 241, 242); // rose-50
            doc.setDrawColor(244, 63, 94); // rose-500
            doc.setLineWidth(0.5);
            doc.rect(x, y, cellSize, cellSize, "FD");

            // Cell number in top-left
            if (i === 0) {
                doc.setFontSize(6);
                doc.setTextColor(190, 24, 93);
                doc.text(String(idx + 1), x + 1, y + 3);
            }
        }
        y += cellSize + 12;
    });

    // Answer page
    doc.addPage();
    addHeader(doc, topic, `${t(locale, "results.crossword")} - ${t(locale, "pdf.answer")}`, pageW);
    y = 55;

    doc.setFontSize(16);
    doc.setTextColor(190, 24, 93);
    doc.text(`${t(locale, "pdf.answer")}:`, margin, y);
    y += 12;

    crosswords.forEach((cw, idx) => {
        if (y > pageH - 25) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text(`${idx + 1}. ${cw.word}`, margin + 5, y);
        y += 8;
    });

    addFooter(doc, locale, 1, 2, pageW, pageH);
    doc.save(`${topic}_krossvord.pdf`);
}

// ==================== PUZZLE PDF ====================
export function generatePuzzlePdf(puzzle: any, topic: string, locale: Locale) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;

    addHeader(doc, topic, t(locale, "pdf.puzzleTitle"), pageW);

    let y = 60;

    // Puzzle icon & title
    doc.setFontSize(22);
    doc.setTextColor(185, 28, 28); // red-700
    doc.text(`🧩 ${t(locale, "pdf.puzzleTitle")}`, pageW / 2, y, { align: "center" });
    y += 20;

    // Puzzle text in a decorative box
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(239, 68, 68); // red-500
    doc.setLineWidth(1);

    const puzzleLines = wrapText(doc, `"${puzzle?.puzzle || ""}"`, contentW - 30);
    const boxH = puzzleLines.length * 8 + 20;
    doc.roundedRect(margin + 10, y - 5, contentW - 20, boxH, 5, 5, "FD");

    doc.setFontSize(16);
    doc.setTextColor(127, 29, 29); // red-900
    doc.text(puzzleLines, pageW / 2, y + 8, { align: "center", maxWidth: contentW - 40 });
    y += boxH + 25;

    // Dotted separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([3, 3], 0);
    doc.line(margin + 30, y, pageW - margin - 30, y);
    doc.setLineDashPattern([], 0);
    y += 20;

    // Answer section
    doc.setFillColor(254, 226, 226); // red-200 
    doc.roundedRect(margin + 20, y - 5, contentW - 40, 30, 4, 4, "F");
    doc.setFontSize(10);
    doc.setTextColor(185, 28, 28);
    doc.text(t(locale, "pdf.puzzleAnswer").toUpperCase(), pageW / 2, y + 3, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    const answerLines = wrapText(doc, puzzle?.answer || "", contentW - 50);
    doc.text(answerLines, pageW / 2, y + 14, { align: "center", maxWidth: contentW - 50 });

    addFooter(doc, locale, 1, 1, pageW, pageH);
    doc.save(`${topic}_jumboq.pdf`);
}
