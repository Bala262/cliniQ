import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai/client'
import { SYSTEM_PROMPTS } from '@/lib/openai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { age, gender, chronicConditions, bmi, bpSystolic, bpDiastolic, bloodSugar } = await request.json()

    const userContent = `
Patient Data:
- Age: ${age ?? 'Unknown'}
- Gender: ${gender ?? 'Unknown'}
- Chronic conditions: ${chronicConditions?.join(', ') || 'None'}
- BMI: ${bmi ?? 'Unknown'}
- Blood pressure: ${bpSystolic ?? '?'}/${bpDiastolic ?? '?'} mmHg
- Blood sugar: ${bloodSugar ?? 'Unknown'}

Assess risk levels.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.riskScoring },
        { role: 'user', content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 200,
    })

    const content = completion.choices[0].message.content ?? '{}'
    const riskScore = JSON.parse(content)

    return NextResponse.json({ riskScore })
  } catch (error) {
    console.error('Risk scoring error:', error)
    return NextResponse.json({ error: 'Failed to calculate risk score' }, { status: 500 })
  }
}
