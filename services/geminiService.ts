
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSlogan = async (productName: string, description: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un eslogan de marketing corto (máximo 5 palabras), impactante y llamativo para un producto llamado "${productName}" que se describe como: "${description}". Responde solo con el texto del eslogan.`,
    });
    return response.text?.trim() || "¡La mejor oferta para vos!";
  } catch (error) {
    console.error("Error generating slogan:", error);
    return "¡Calidad garantizada!";
  }
};

export const suggestProductColor = async (productName: string, imageData?: string): Promise<string> => {
  try {
    const parts: any[] = [{ text: `Analiza este producto: "${productName}". Sugiere un único código de color HEX (ej. #FF5733) que sea vibrante y combine perfectamente con la estética del producto para una propaganda premium. Responde ÚNICAMENTE con el código HEX.` }];
    
    if (imageData && imageData.startsWith('data:')) {
      const [mime, data] = imageData.split(';base64,');
      parts.push({
        inlineData: {
          mimeType: mime.split(':')[1],
          data: data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    
    const hex = response.text?.trim().match(/#[0-9A-Fa-f]{6}/)?.[0];
    return hex || "#4f46e5";
  } catch (error) {
    console.error("Error suggesting color:", error);
    return "#4f46e5";
  }
};

export const generateProductImage = async (productName: string): Promise<string | null> => {
  try {
    const prompt = `A professional, high-quality commercial studio photography of ${productName}. Clean background, cinematic lighting, 4k resolution, hyper-realistic, professional product placement.`;
    
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

    // Iterate through parts to find the image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
