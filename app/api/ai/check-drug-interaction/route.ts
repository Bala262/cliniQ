import { NextRequest, NextResponse } from 'next/server'
import { getOpenAI } from '@/lib/openai/client'
import { SYSTEM_PROMPTS } from '@/lib/openai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { medicines } = await request.json()

    if (!medicines || medicines.length < 2) {
      return NextResponse.json({ interactions: [] })
    }

    const medicineList = medicines.map((m: { name: string }) => m.name).join(', ')

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.drugInteractionCheck },
        { role: 'user', content: `Check interactions for: ${medicineList}` },
      ],
      temperature: 0.1,
      max_tokens: 400,
    })

    const content = completion.choices[0].message.content ?? '[]'
    const interactions = JSON.parse(content)

    return NextResponse.json({ interactions })
  } catch (error) {
    console.error('Drug interaction check error:', error)
    return NextResponse.json({ error: 'Failed to check drug interactions' }, { status: 500 })
  }
}
