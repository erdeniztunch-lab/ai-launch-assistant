import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================
// Configuration
// ============================================

const GEMINI_MODEL = "gemini-3-flash-preview";

// Initialize Gemini
export function initGemini(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
}

// ============================================
// Core API Call with JSON Response
// ============================================

export async function callGemini(model, prompt, expectJSON = true) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (expectJSON) {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
        text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonText);
      }
      throw new Error("No valid JSON found in response");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// ============================================
// Structured Prompt Helper
// ============================================

export function createStructuredPrompt(systemPrompt, userInput) {
  return `${systemPrompt}

User Input:
${JSON.stringify(userInput, null, 2)}

Respond with valid JSON only.`;
}

// ============================================
// Rate Limiting Helper (Free Tier)
// ============================================

class RateLimiter {
  constructor(maxRequests = 15, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async waitIfNeeded() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitIfNeeded();
    }

    this.requests.push(now);
  }
}

export const geminiRateLimiter = new RateLimiter();

// ============================================
// Safe API Call with Rate Limiting
// ============================================

export async function safeCallGemini(model, prompt, expectJSON = true) {
  await geminiRateLimiter.waitIfNeeded();
  return callGemini(model, prompt, expectJSON);
}

// ============================================
// Export all
// ============================================

export default {
  initGemini,
  callGemini,
  safeCallGemini,
  createStructuredPrompt,
  geminiRateLimiter
};