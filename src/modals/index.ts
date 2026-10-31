import { ModalInterface } from '@/interface/ModalInterface'
import { ValidModel } from '@/constants/valid_modals'

import { OpenAI_3_5_turbo } from '@/modals/modal/OpenAI_3_5_turbo'
import { GeminiAI_1_5_pro } from '@/modals/modal/GeminiAI_1_5_pro'
import { OpenAi_4o } from './modal/OpenAI_40'
import { OllamaModal } from './modal/Ollama'

/**
 * This object contains all the modals that are available in the extension.
 * @type {Record<ValidModel, ModalInterface>}
 */
export const modals: Record<ValidModel, ModalInterface> = {
  ollama: new OllamaModal(),
  ollama_gemma3: new OllamaModal(),
  'openai_3.5_turbo': new OpenAI_3_5_turbo(),
  openai_4o: new OpenAi_4o(),
  'gemini_1.5_pro': new GeminiAI_1_5_pro(),
}
