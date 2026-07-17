const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions'

interface CerebrasChatResponse {
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

export class CerebrasError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CerebrasError'
  }
}

export async function callCerebras(
  mealDescription: string,
  systemPrompt: string,
): Promise<AIProviderResult> {
  const apiKey = process.env.CEREBRAS_API_KEY

  if (!apiKey) {
    throw new CerebrasError('CEREBRAS_API_KEY no está configurada')
  }

  const response = await fetch(CEREBRAS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: mealDescription },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new CerebrasError(`Cerebras respondió ${response.status}: ${errorBody}`)
  }

  const data: CerebrasChatResponse = await response.json()

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new CerebrasError('Cerebras retornó una respuesta vacía')
  }

  return { content, provider: 'cerebras' }
}
