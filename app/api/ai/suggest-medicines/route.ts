import { NextRequest, NextResponse } from 'next/server'
import { getOpenAI } from '@/lib/openai/client'
import { SYSTEM_PROMPTS } from '@/lib/openai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { diagnosis, allergies, patientAge, chronicConditions } = await request.json()

    if (!diagnosis) {
      return NextResponse.json({ error: 'Diagnosis is required' }, { status: 400 })
    }

    const userContent = `
Diagnosis: ${diagnosis}
Patient age: ${patientAge ?? 'Unknown'}
Known allergies: ${allergies?.join(', ') || 'None'}
Chronic conditions: ${chronicConditions?.join(', ') || 'None'}

Suggest appropriate medicines for this condition.`

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.medicineSuggestion },
        { role: 'user', content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 600,
    })

    const content = completion.choices[0].message.content ?? '[]'
    const medicines = JSON.parse(content)

    return NextResponse.json({ medicines })
  } catch (error) {
    console.error('Medicine suggestion error:', error)
    return NextResponse.json({ error: 'Failed to suggest medicines' }, { status: 500 })
  }
}
