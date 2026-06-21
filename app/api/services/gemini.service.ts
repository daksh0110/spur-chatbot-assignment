import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateResponse = async (content: string): Promise<string> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });

    if (!response.text) {
      throw new Error("No response received from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini service error:", error);
    throw new Error(
      `Failed to generate response: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export default { generateResponse };
