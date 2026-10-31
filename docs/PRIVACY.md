# Privacy

Ollama is the default provider. When selected, problem statements, editor contents, and chat messages are sent to the configured local endpoint, normally `http://localhost:11434`, and not to a Code-Bhumi server. The extension declares host access only for localhost and loopback Ollama endpoints.

The extension does not execute generated code, does not claim compiler or runtime results, and does not inject generated HTML into the page. Chrome storage contains provider configuration. Existing chat history is stored locally in IndexedDB. Users can remove it through the existing clear-chat action or by clearing extension storage in Chrome.

Gemini and OpenAI remain legacy opt-in providers for compatibility with the original project. If enabled, their own service terms and data handling apply. API keys must be entered by the user and are stored in extension-local storage; do not commit keys or place them in source code.
