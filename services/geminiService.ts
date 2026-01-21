
import { GoogleGenAI } from "@google/genai";

export const generateAIContent = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.');
  }
  // Always initialize GoogleGenAI with { apiKey: process.env.API_KEY } as per guidelines
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        // Avoid setting maxOutputTokens unless a thinking budget is also defined; 
        // recommendation is to let the model decide for best results.
        temperature: 0.7,
      }
    });
    return response.text || "No content generated.";
  } catch (error) {
    throw error;
  }
};

export const generateAIImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.');
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });
    
    let base64Data = '';
    // Iterate through candidates and parts to find the image payload
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        base64Data = part.inlineData.data;
        break;
      }
    }
    
    if (base64Data) {
      return `data:image/png;base64,${base64Data}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    throw error;
  }
};
