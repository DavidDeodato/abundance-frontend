
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { API_KEY_ERROR_MESSAGE, GEMINI_MODEL_TEXT } from '../constants';
import { Page } from "../types";

const getApiKey = (): string | undefined => {
  // In a real Vite app, environment variables are typically accessed via `import.meta.env.VITE_API_KEY`
  // For this environment, we'll assume `process.env.API_KEY` is available.
  // If not building with Node.js env, this might need adjustment based on the actual runtime.
  try {
    return process.env.API_KEY;
  } catch (e) {
    // This will happen if process is not defined (e.g. browser context without specific build tool setup for process.env)
    // In a Vite project, you would use import.meta.env.VITE_YOUR_VARIABLE
    // For now, let's try to fetch it from a global variable if it was set somehow or return undefined
    // @ts-ignore
    return window.API_KEY || undefined;
  }
};


let ai: GoogleGenAI | null = null;
const apiKey = getApiKey();

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(API_KEY_ERROR_MESSAGE);
}

export const generateContextualContent = async (prompt: string, contextPage: Page): Promise<string> => {
  if (!ai) {
    // Fallback or mock response if API key is not available
    return `(Mock response as API key is not configured) AI anwser for: "${prompt}" in context of ${contextPage}. This is a simulated intelligent response. In a real scenario, I would provide detailed information based on your current page and query. For example, if you asked about 'next steps' on the Dashboard, I would analyze your progress and suggest relevant actions.`;
  }

  const systemInstruction = `Você é um assistente especialista da plataforma Abundance Brasil. Seu objetivo é ajudar proprietários de terra e empresas na jornada de monetização de ativos ambientais. Seja profissional, data-driven, educativo e empoderador. Responda em Português do Brasil. Contexto atual do usuário: ${contextPage}.`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: [{ role: "user", parts: [{text: prompt}] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });
    
    let text = response.text.trim();
    // Remove markdown fences for JSON if present, although here we expect text
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = text.match(fenceRegex);
    if (match && match[2]) {
      text = match[2].trim();
    }
    return text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        return "Erro: A chave da API não é válida. Por favor, verifique a configuração.";
    }
    return "Desculpe, ocorreu um erro ao tentar obter uma resposta da IA. Por favor, tente novamente mais tarde.";
  }
};

export const analyzeImageWithPrompt = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  if (!ai) {
    return `(Mock response for image analysis) AI analysis for prompt: "${prompt}" on the provided image. This simulated response would typically describe the image content or answer questions related to it.`;
  }

  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType, // e.g., 'image/jpeg' or 'image/png'
      data: base64Image,
    },
  };

  const textPart: Part = {
    text: prompt,
  };
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT, // Or a multimodal model if specified and different
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for image analysis:", error);
    return "Desculpe, ocorreu um erro ao analisar a imagem.";
  }
};