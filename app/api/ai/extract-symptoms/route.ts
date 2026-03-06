import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai/client'
import { SYSTEM_PROMPTS } from '@/lib/openai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()

    if (!transcript || transcript.trim().length < 5) {
      return NextResponse.json({ error: 'Transcript too short' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.symptomExtraction },
        { role: 'user', content: transcript },
      ],
      temperature: 0.2,
      max_tokens: 500,
    })

    const content = completion.choices[0].message.content ?? '[]'
    const symptoms = JSON.parse(content)

    return NextResponse.json({ symptoms })
  } catch (error) {
    console.error('Symptom extraction error:', error)
    return NextResponse.json({ error: 'Failed to extract symptoms' }, { status: 500 })
  }
}
