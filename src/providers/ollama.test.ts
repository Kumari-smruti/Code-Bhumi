import { describe, expect, it } from 'vitest'
import { normalizeEndpoint, parseOllamaConfig } from './ollama'

describe('Ollama configuration', () => {
  it('uses safe local defaults', () => {
    expect(parseOllamaConfig()).toEqual({ endpoint: 'http://localhost:11434', model: 'qwen3:4b' })
  })

  it('normalizes endpoint slashes and keeps the selected model', () => {
    expect(parseOllamaConfig('{"endpoint":"http://127.0.0.1:11434///","model":"gemma3:4b"}')).toEqual({
      endpoint: 'http://127.0.0.1:11434',
      model: 'gemma3:4b',
    })
    expect(normalizeEndpoint('  http://localhost:11434/ ')).toBe('http://localhost:11434')
  })

  it('treats legacy model-only values as model names', () => {
    expect(parseOllamaConfig('qwen3:4b')).toEqual({ endpoint: 'http://localhost:11434', model: 'qwen3:4b' })
  })
})
