import { NextRequest, NextResponse } from 'next/server'
import { getOpenAI } from '@/lib/openai/client'
import { SYSTEM_PROMPTS } from '@/lib/openai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { symptoms, patientAge, patientGender, chronicConditions, allergies } = await request.json()

    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json({ error: 'No symptoms provided' }, { status: 400 })
    }

    const userContent = `
Patient Info:
- Age: ${patientAge ?? 'Unknown'}
- Gender: ${patientGender ?? 'Unknown'}
- Chronic conditions: ${chronicConditions?.join(', ') || 'None'}
- Known allergies: ${allergies?.join(', ') || 'None'}

Extracted symptoms:
${symptoms.map((s: { symptom: string; duration: string | null; severity: string | null }) =>
  `- ${s.symptom}${s.duration ? ` (${s.duration})` : ''}${s.severity ? ` — ${s.severity}` : ''}`
).join('\n')}
`

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.diagnosisSuggestion },
        { role: 'user', content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 600,
    })

    const content = completion.choices[0].message.content ?? '[]'
    const diagnoses = JSON.parse(content)

    return NextResponse.json({ diagnoses })
  } catch (error) {
    console.error('Diagnosis suggestion error:', error)
    return NextResponse.json({ error: 'Failed to suggest diagnosis' }, { status: 500 })
  }
}
