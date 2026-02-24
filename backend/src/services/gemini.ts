import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const API_KEYS = process.env.GEMINI_API_KEYS?.split(",") || [];
let currentKeyIndex = 0;

const getNextApiKey = () => {
    if (API_KEYS.length === 0) throw new Error("No Gemini API keys provided");
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
};

// Generates the content using Gemini
export const generateContentFromGemini = async (promptText: string) => {
    let attempt = 0;
    while (attempt < API_KEYS.length) {
        try {
            const apiKey = getNextApiKey();
            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", // or "gemini-1.5-pro", depending on availability. Gemini 2.5 is the latest version.
                contents: promptText,
                config: {
                    responseMimeType: "application/json",
                }
            });
            return JSON.parse(response.text || "{}");
        } catch (error: any) {
            console.error("Gemini API error with key attempt", attempt + 1, ":", error?.message);
            attempt++;
        }
    }
    throw new Error("All Gemini API keys failed limit or errors.");
};
