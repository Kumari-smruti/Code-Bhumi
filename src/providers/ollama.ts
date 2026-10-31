import { outputSchema, type LearningOutput } from '@/schema/modeOutput'

type OllamaModel = {
  name: string
  model?: string
  size?: number
  digest?: string
  details?: {
    family?: string
    parameter_size?: string
    quantization_level?: string
  }
}

type OllamaChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

type OllamaConfig = { endpoint: string; model: string }

const DEFAULT_ENDPOINT = 'http://localhost:11434'
const REQUEST_TIMEOUT_MS = 45_000
const MAX_CONTEXT_CHARS = 18_000

export function normalizeEndpoint(endpoint: string) {
  const trimmed = endpoint.trim().replace(/\/+$/, '')
  return trimmed || DEFAULT_ENDPOINT
}

export function parseOllamaConfig(value?: string): OllamaConfig {
  if (!value) return { endpoint: DEFAULT_ENDPOINT, model: 'qwen3:4b' }
  try {
    const parsed = JSON.parse(value) as Partial<OllamaConfig>
    return {
      endpoint: normalizeEndpoint(parsed.endpoint || DEFAULT_ENDPOINT),
      model: parsed.model?.trim() || 'qwen3:4b',
    }
  } catch {
    return { endpoint: DEFAULT_ENDPOINT, model: value.trim() || 'qwen3:4b' }
  }
}

export class OllamaClient {
  constructor(private readonly config: OllamaConfig) {}

  async listModels(signal?: AbortSignal): Promise<OllamaModel[]> {
    const response = await this.fetchWithTimeout(`${normalizeEndpoint(this.config.endpoint)}/api/tags`, {
      method: 'GET',
      signal,
    })
    if (!response.ok) throw new Error(`Ollama returned ${response.status} while listing models.`)
    const body = (await response.json()) as { models?: OllamaModel[] }
    return Array.isArray(body.models) ? body.models : []
  }

  async checkConnection(signal?: AbortSignal) {
    try {
      await this.listModels(signal)
      return { connected: true, message: 'Ollama is reachable.' }
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Ollama is unavailable.',
      }
    }
  }

  async chat(messages: OllamaChatMessage[], signal?: AbortSignal): Promise<LearningOutput> {
    const safeMessages = messages.map((message) => ({
      ...message,
      content: message.content.slice(0, MAX_CONTEXT_CHARS),
    }))
    const response = await this.fetchWithTimeout(`${normalizeEndpoint(this.config.endpoint)}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        messages: safeMessages,
        stream: false,
        format: 'json',
        options: { temperature: 0.2 },
      }),
      signal,
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(detail || `Ollama returned ${response.status}. Is model ${this.config.model} installed?`)
    }
    const body = (await response.json()) as { message?: { content?: string } }
    const content = body.message?.content
    if (!content) throw new Error('Ollama returned an empty response.')
    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      throw new Error('Ollama returned malformed JSON. Try a model with structured-output support.')
    }
    const result = outputSchema.safeParse(parsed)
    if (!result.success) throw new Error('Ollama response did not match the Code-Bhumi learning schema.')
    return result.data
  }

  private async fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}) {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const onAbort = () => controller.abort()
    init.signal?.addEventListener('abort', onAbort, { once: true })
    try {
      return await fetch(input, { ...init, signal: controller.signal })
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error('Ollama request timed out or was cancelled.')
      }
      throw new Error(error instanceof Error ? error.message : 'Unable to reach Ollama.')
    } finally {
      window.clearTimeout(timeout)
      init.signal?.removeEventListener('abort', onAbort)
    }
  }
}
