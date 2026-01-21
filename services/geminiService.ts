
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeBlog = async (url: string, content?: string): Promise<AuditResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = content 
    ? `Analyze the following blog content for SEO and GEO (Generative Engine Optimization). 
       Content: ${content.substring(0, 15000)}` 
    : `Use Google Search grounding to find the blog post at this URL and analyze its content for SEO and GEO: ${url}. 
       Evaluate the page title, structure, and readability for both traditional search engines (Google) and AI models (ChatGPT, Perplexity, Gemini).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          seoScore: { type: Type.NUMBER, description: "A score out of 100 for traditional search optimization" },
          geoScore: { type: Type.NUMBER, description: "A score out of 100 for Generative Engine Optimization (citatations, facts, entity density)" },
          seoSummary: { type: Type.STRING },
          geoSummary: { type: Type.STRING },
          seoImprovements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                effort: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard"] }
              },
              required: ["category", "suggestion", "impact", "effort"]
            }
          },
          geoImprovements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                effort: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard"] }
              },
              required: ["category", "suggestion", "impact", "effort"]
            }
          },
          metaTags: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "keywords"]
          }
        },
        required: ["seoScore", "geoScore", "seoSummary", "geoSummary", "seoImprovements", "geoImprovements", "metaTags"]
      }
    }
  });

  const text = response.text;
  try {
    return JSON.parse(text) as AuditResult;
  } catch (err) {
    console.error("Failed to parse Gemini response", text);
    throw new Error("Invalid response format from analysis engine.");
  }
};
