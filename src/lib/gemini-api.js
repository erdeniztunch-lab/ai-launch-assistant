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
// Safe API Call with Rate Limiting + Retries
// ============================================

// Sleep helper
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Determine whether an error should be treated as transient and retried
function isTransientError(error) {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  const code = error.status || error.statusCode || error.code || '';

  if (code === 429 || code === 503) return true;
  if (msg.includes('overloaded') || msg.includes('rate limit') || msg.includes('timed out') || msg.includes('timeout') || msg.includes('unavailable')) return true;

  return false;
}

/**
 * Safe call with rate limiting and retries for transient errors like
 * "model is overloaded" or HTTP 429/503.
 *
 * Options:
 *  - maxRetries: number (default 5)
 *  - initialDelay: ms (default 500)
 *  - factor: exponential factor (default 2)
 *  - jitter: fraction (0-1) to add randomness (default 0.2)
 */
export async function safeCallGemini(model, prompt, expectJSON = true, options = {}) {
  const { maxRetries = 5, initialDelay = 500, factor = 2, jitter = 0.2 } = options;
  await geminiRateLimiter.waitIfNeeded();

  let attempt = 0;
  while (true) {
    try {
      attempt++;
      return await callGemini(model, prompt, expectJSON);
    } catch (error) {
      // If not transient or max attempts exhausted, rethrow
      if (attempt > maxRetries || !isTransientError(error)) {
        console.error(`Gemini failed after ${attempt} attempt(s):`, error);
        throw error;
      }

      const baseDelay = initialDelay * Math.pow(factor, attempt - 1);
      const jitterMs = Math.floor(baseDelay * (Math.random() * jitter));
      const delay = Math.floor(baseDelay + jitterMs);

      console.warn(`Transient Gemini error (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`, error.message);
      await sleep(delay);
    }
  }
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