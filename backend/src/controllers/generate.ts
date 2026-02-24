import { Request, Response } from "express";
import prisma from "../config/prisma";
import { generateContentFromGemini } from "../services/gemini";

const LIMITS: Record<string, number> = {
  FREE: 5,
  USTOZ: 100,
  KATTA_USTOZ: 250,
};

export const generateContent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { subject, classLevel, language, topic } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.generationsCount >= (LIMITS[user.role] || 5)) {
      return res.status(403).json({ message: "Tarif limitiga yetib keldingiz!" });
    }

    const prompt = `Sen "O'qituvchi AI" nomli platformasan. 
Mavzu: ${topic}
Fan: ${subject}
Sinf: ${classLevel}
Til: ${language}

Quyidagi tuzilmaga ega JSON formatida (qoshimcha matnlarsiz, faqat JSON formatida) qaytar:
{
  "slides": [
    { "title": "Slayd 1", "points": ["punkt 1", "punkt 2"], "imagePrompt": "A highly detailed, visually appealing educational illustration for the topic: [Mavzu]. Vibrant colors, modern 3d render style." } // 10 dona slayd. Har bir slaydning 'imagePrompt' maydoniga rasm generatsiya qilish uchun ingliz tilida mukammal va tasviriy promt yozing.
  ],
  "tests": [
    { "question": "Savol?", "options": ["A variant", "B variant", "C variant", "D variant"], "answerIndex": 0 } // 10 ta. 'answerIndex' - to'g'ri variantning arraydagi (0=A, 1=B, 2=C, 3=D) tartib raqami
  ],
  "qa": [
    { "question": "Savol?", "answer": "Javob" } // 10 ta. Savol nomiga 'Q.' yoki boshqa harf qoshilmasin
  ],
  "game": {
    "scenario": "O'yin ssenariysi",
    "rules": "Qoidalar",
    "equipment": "Kerakli jihozlar",
    "steps": ["qadam 1", "qadam 2"]
  },
  "crossword": [
    { "word": "JAVOB", "clue": "Savol" } // 5 ta
  ],
  "logicPuzzle": { "puzzle": "Jumboq", "answer": "Javob" }
}

Faqat valid JSON qaytar, chunki natija darhol JSON.parse qilinadi. ${language === 'uz' ? 'Barcha matnlar Oʻzbek tilida boʻlsin.' : language === 'ru' ? 'Все тексты должны быть на русском.' : 'All texts must be in English.'}`;

    const content = await generateContentFromGemini(prompt);

    const generation = await prisma.generation.create({
      data: {
        userId,
        subject,
        class: Number(classLevel),
        language,
        topic,
        content,
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { generationsCount: { increment: 1 } }
    });

    return res.json({ generation });
  } catch (error: any) {
    console.error("Generation error:", error);
    return res.status(500).json({ error: error.message || "Generation error" });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const history = await prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ history });
  } catch (error: any) {
    console.error("History fetch error:", error);
    return res.status(500).json({ error: "History fetch error" });
  }
};
