import { OllamaClient, parseOllamaConfig } from '@/providers/ollama'
import type {
  GenerateResponseParamsType,
  GenerateResponseReturnType,
} from '@/interface/ModalInterface'
import { ModalInterface } from '@/interface/ModalInterface'
import { outputSchema } from '@/schema/modeOutput'

export class OllamaModal extends ModalInterface {
  name = 'ollama'
  private serializedConfig = ''

  init(config?: string) {
    this.serializedConfig = config || ''
  }

  async generateResponse(props: GenerateResponseParamsType): GenerateResponseReturnType {
    try {
      const config = parseOllamaConfig(this.serializedConfig)
      const client = new OllamaClient(config)
      const result = await client.chat([
        { role: 'system', content: `${props.systemPrompt}\n\nReturn JSON only matching the Code-Bhumi schema.` },
        ...props.messages
          .filter((message) => ['system', 'user', 'assistant'].includes(message.role))
          .map((message) => ({
            role: message.role as 'system' | 'user' | 'assistant',
            content: String(message.content),
          })),
        { role: 'user', content: props.prompt },
      ])
      return { error: null, success: outputSchema.parse(result) }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Ollama request failed.'), success: null }
    }
  }
}
