const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface GroqChatResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface AIProviderResult {
  content: string
  provider: string
}

export class GroqError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GroqError'
  }
}

export async function callGroq(
  mealDescription: string,
  systemPrompt: string,
): Promise<AIProviderResult> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new GroqError('GROQ_API_KEY no está configurada')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: mealDescription },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new GroqError(`Groq respondió ${response.status}: ${errorBody}`)
  }

  const data: GroqChatResponse = await response.json()

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new GroqError('Groq retornó una respuesta vacía')
  }

  return { content, provider: 'groq' }
}
