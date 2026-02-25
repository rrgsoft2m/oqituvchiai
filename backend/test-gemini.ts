import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config({ path: "backend/.env" });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEYS?.split(',')[0] });
async function test() {
  const prompt = `Sen "O'qituvchi AI" nomli platformasan. 
Mavzu: Python dasturlash tili
Fan: Informatika va AT
Sinf: 8-sinf
Til: uz

Quyidagi tuzilmaga ega JSON formatida (qoshimcha matnlarsiz, faqat JSON formatida) qaytar:
{
  "slides": [
    { "title": "Slayd 1 nomi", "points": ["Slayd uchun birinchi batafsil punkt. Matn kamida 2-3 ta gapdan iborat bo'lib, o'quvchiga mavzuni chuqur tushuntirishi kerak.", "Ikkinchi uzun va qiziqarli ma'lumot. Ushbu slayd mavzusi bo'yicha ko'proq nazariy qism va rekvizitlar yozib qoldiring.", "Uchinchi qism, qo'shimcha fakt yoki tavsif. Har bir slaydda ma'lumotlar boy va keng bo'lishi shart."], "imageKeyword": "python,programming" } // DASTUR BO'YICHA 10 dona slayd! HAR BIR SLAYDDA kamida 3-4 ta UZUN va BATAFSIL (faktlarga boy) punktlar bo'lishi shart. 'imageKeyword' maydoniga rasm qidirish uchun aynan shu slaydga xos ENGLIZ TILIDAGI 1-2 ta eng aniq kalit so'zni yozing (masalan, 'python,code', 'algorithm,chart', 'biology,dna').
  ],
  "tests": []
}

Faqat valid JSON qaytar, chunki natija darhol JSON.parse qilinadi. Barcha matnlar Oʻzbek tilida boʻlsin.`;

  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
  });
  console.log(response.text);
}
test();
