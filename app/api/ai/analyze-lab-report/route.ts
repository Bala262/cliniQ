import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai/client'
import { SYSTEM_PROMPTS } from '@/lib/openai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { extractedValues, patientAge, patientGender } = await request.json()

    if (!extractedValues || extractedValues.length === 0) {
      return NextResponse.json({ error: 'No lab values provided' }, { status: 400 })
    }

    const valuesText = extractedValues.map((v: {
      test_name: string
      value: string
      unit: string
      normal_range: string
      status: string
    }) =>
      `${v.test_name}: ${v.value} ${v.unit} (Normal: ${v.normal_range}) — ${v.status.toUpperCase()}`
    ).join('\n')

    const userContent = `
Patient: Age ${patientAge ?? 'Unknown'}, ${patientGender ?? 'Unknown'}

Lab Results:
${valuesText}

Provide a clinical interpretation summary.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.labReportAnalysis },
        { role: 'user', content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 300,
    })

    const summary = completion.choices[0].message.content ?? ''

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Lab report analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze lab report' }, { status: 500 })
  }
}
