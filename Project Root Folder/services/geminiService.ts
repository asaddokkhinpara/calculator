
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are AuraCalc AI, a world-class mathematical assistant. 
Your goals:
1. Help users solve complex math problems, word problems, and equations.
2. Provide step-by-step explanations for mathematical concepts.
3. Be concise but thorough.
4. Format math expressions using clean notation.
5. If asked for a simple calculation that can be done on a normal calculator, provide the result immediately.
6. If asked about units or conversions, provide the formula used.
`;

export const solveMathProblem = async (query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Failed to connect to the AI assistant. Please try again.";
  }
};
