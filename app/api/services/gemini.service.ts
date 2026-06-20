import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateResponse = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });

    return response.text ?? "";
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
};

export default { generateResponse };
