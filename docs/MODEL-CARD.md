# Model card and runtime notes

## Qwen3 4B

The verified Ollama tag is `qwen3:4b`. The official Ollama model page lists the 4B variant at approximately 2.5 GB with a 256K context window. The weights are distributed under the Qwen license. Review the upstream license before redistribution.

## Gemma 3 4B

The verified Ollama tag is `gemma3:4b`. The official Ollama page lists it as a multimodal 4B model with a 128K context window and states that it requires Ollama 0.6 or later. Gemma 3 uses Google's Gemma Terms of Use.

## Runtime

Ollama exposes a local HTTP API. Code-Bhumi uses the documented `/api/tags` and `/api/chat` endpoints. The application license is GPL-3.0, the Ollama runtime is MIT-licensed, and model terms remain separate. Code-Bhumi calls these models open-weight rather than universally open source.
