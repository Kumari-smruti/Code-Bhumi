import { z } from 'zod'

const SupportedLanguages = [
  'c', 'cpp', 'csharp', 'cs', 'dart', 'elixir', 'erlang', 'go', 'java',
  'javascript', 'jsonp', 'jsx', 'php', 'python', 'racket', 'rkt', 'ruby',
  'rb', 'rust', 'scala', 'sql', 'swift', 'typescript', 'tsx', 'unknown',
] as const

export const learningTaskSchema = z.enum([
  'progressive_hint', 'problem_explanation', 'code_review', 'debugging',
  'complexity_analysis', 'test_case_generator', 'explain_code', 'chat',
])

export const outputSchema = z.object({
  status: z.enum(['success', 'error']).default('success'),
  task: learningTaskSchema.default('chat'),
  feedback: z.string().min(1),
  summary: z.string().optional(),
  hints: z.array(z.string()).max(5).optional(),
  level: z.number().int().min(1).max(5).optional(),
  findings: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
  testCases: z.array(z.string()).optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  snippet: z.string().optional(),
  programmingLanguage: z.enum(SupportedLanguages).optional(),
  confidence: z.enum(['low', 'medium', 'high']).default('medium'),
})

export type LearningOutput = z.infer<typeof outputSchema>
