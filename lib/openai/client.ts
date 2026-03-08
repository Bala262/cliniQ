import OpenAI from 'openai'

let _client: OpenAI | null = null

/** Lazy-initialized OpenAI client so build doesn't require OPENAI_API_KEY. */
export function getOpenAI(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }
    _client = new OpenAI({ apiKey })
  }
  return _client
}
