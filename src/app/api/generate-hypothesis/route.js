import { NextResponse } from 'next/server'
import { initGemini, safeCallGemini } from '@/lib/gemini-api'
import { PROMPT_GENERATE_HYPOTHESIS, fillPrompt } from '@/lib/prompts'

export async function POST(request) {
    try {
        const body = await request.json()
        const { product, audience, artifact, learningGoal } = body

        // Initialize Gemini
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not found' },
                { status: 500 }
            )
        }

        const model = initGemini(apiKey)

        // Prepare context
        const context = {
            PRODUCT_DESCRIPTION: product,
            TARGET_AUDIENCE: audience,
            CURRENT_ARTIFACT: artifact,
            LEARNING_GOAL: learningGoal
        }

        // Fill the prompt and send it to Gemini
        const prompt = fillPrompt(PROMPT_GENERATE_HYPOTHESIS, context)
        const result = await safeCallGemini(model, prompt, true)

        return NextResponse.json(result)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}