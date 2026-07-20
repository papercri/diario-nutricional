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
const API_ROUTES = ['/api/analyze-meal', '/api/generate-recipe']

const server = createServer(async (req, res) => {
  console.log(`[api-dev] ${req.method} ${req.url}`)

  if (req.method === 'POST' && API_ROUTES.includes(req.url ?? '')) {
    let body = ''
    for await (const chunk of req) {
      body += chunk
    }

    try {
      const parsed = JSON.parse(body)
      const fakeReq = {
        method: 'POST',
        url: req.url,
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

      const handlerPath =
        req.url === '/api/analyze-meal' ? './api/analyze-meal.ts' : './api/generate-recipe.ts'
      const { default: handler } = await import(handlerPath)
      await handler(fakeReq as never, fakeRes as never)

      res.writeHead(statusCode, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(responseData))
    } catch (err) {
      console.error('[api-dev] Error en handler:', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: 'Error interno del servidor' }))
    }
  } else {
    console.warn(`[api-dev] 404 — ${req.method} ${req.url}`)
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`[api-dev] Servidor API escuchando en http://localhost:${PORT}`)
  console.log(`[api-dev] Rutas: ${API_ROUTES.join(', ')}`)
})
