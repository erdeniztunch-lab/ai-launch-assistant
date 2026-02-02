import { NextResponse } from 'next/server'
import { initGemini, safeCallGemini } from '@/lib/gemini-api'
import { PROMPT_SELECT_LAUNCH_TYPE, fillPrompt } from '@/lib/prompts'

export async function POST(request) {
    try {
        const body = await request.json()
        const { hypothesis, artifact } = body

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not found' },
                { status: 500 }
            )
        }

        const model = initGemini(apiKey)

        const context = {
            HYPOTHESIS: hypothesis,
            ARTIFACT_TYPE: artifact
        }

        const prompt = fillPrompt(PROMPT_SELECT_LAUNCH_TYPE, context)
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