import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      const value = trimmed.slice(eqIndex + 1).trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    console.warn('No se encontró .env.local')
  }
}

loadEnv()

const PORT = 3001

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/analyze-meal') {
    let body = ''
    for await (const chunk of req) {
      body += chunk
    }

    try {
      const parsed = JSON.parse(body)
      const fakeReq = {
        method: 'POST',
        url: '/api/analyze-meal',
        headers: { 'content-type': 'application/json' },
        body: parsed,
      }

      let statusCode = 200
      let responseData: unknown = {}

      const fakeRes = {
        status: (code: number) => {
          statusCode = code
          return {
            json: (data: unknown) => {
              responseData = data
            },
          }
        },
      }

      const { default: handler } = await import('./api/analyze-meal.ts')
      await handler(fakeReq as never, fakeRes as never)

      res.writeHead(statusCode, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(responseData))
    } catch (err) {
      console.error('Error en API handler:', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: 'Error interno del servidor' }))
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`[api-dev] Servidor API escuchando en http://localhost:${PORT}`)
})
