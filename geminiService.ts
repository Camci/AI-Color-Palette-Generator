import { GoogleGenAI, Type, Part } from "@google/genai";
import { Palette } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const colorPaletteSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      hex: {
        type: Type.STRING,
        description: 'The hexadecimal color code, e.g., "#RRGGBB".',
      },
      name: {
        type: Type.STRING,
        description: 'A creative and descriptive name for the color.',
      },
    },
    required: ["hex", "name"],
  },
};

export async function generateColorPalette(
    prompt: string,
    image: { mimeType: string; data: string } | null
): Promise<Palette> {
  try {
    const parts: Part[] = [];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }
    
    const effectivePrompt = (prompt || (image ? "Generate a 5-color palette based on this image." : "Generate a 5-color palette.")).trim();
    parts.push({ text: effectivePrompt });
    
    const contents = { parts };

    const systemInstruction = image 
        ? "You are an expert color palette generator. Analyze the provided image and the user's text prompt to create a harmonious 5-color palette. The palette should reflect the image's mood, main subjects, and lighting. Return it as a JSON array of objects, each with a 'hex' code and a 'name'."
        : "You are an expert color palette generator for designers. Based on the user's text prompt, create a harmonious and aesthetically pleasing color palette. Ensure high contrast and complementary colors. Return the palette as a JSON array of objects, where each object has a 'hex' code and a 'name'.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: colorPaletteSchema,
        temperature: 0.8,
        topP: 1,
      },
    });

    const text = response.text.trim();
    // Sanitize response which might be wrapped in ```json markdown
    const sanitizedText = text.replace(/^```json\s*|```\s*$/g, '');
    const palette = JSON.parse(sanitizedText);

    if (!Array.isArray(palette) || palette.some(c => !c.hex || !c.name)) {
        throw new Error("Invalid palette format received from API.");
    }
    
    return palette as Palette;

  } catch (error) {
    console.error("Error generating color palette:", error);
    let errorMessage = "Failed to generate palette. Please try again.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
}