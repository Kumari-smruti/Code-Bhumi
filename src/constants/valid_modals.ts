export const VALID_MODELS = [
  {
    model: 'qwen3:4b',
    name: 'ollama',
    display: 'Ollama · local open-weight',
    local: true,
  },
  {
    model: 'gemma3:4b',
    name: 'ollama_gemma3',
    display: 'Ollama · Gemma 3 4B',
    local: true,
  },
  { model: 'gpt-3.5-turbo', name: 'openai_3.5_turbo', display: 'OpenAI GPT-3.5 (legacy)' },
  { model: 'gpt-4o', name: 'openai_4o', display: 'OpenAI GPT-4o (legacy)' },
  { model: 'gemini-1.5-pro-latest', name: 'gemini_1.5_pro', display: 'Gemini 1.5 Pro (legacy)' },
] as const

export type ValidModel = (typeof VALID_MODELS)[number]['name']
