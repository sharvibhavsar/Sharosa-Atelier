import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Say hello like a friendly chatbot",
  });

  console.log(response.text);
}

run();