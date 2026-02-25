import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEYS?.split(',')[0] });
async function test() {
  const response = await ai.models.list();
  for await (const model of response) {
    if (model.name.includes("image") || model.name.includes("banana")) {
        console.log("Found:", model.name);
    }
  }
}
test().catch(e => console.error(e.message));
