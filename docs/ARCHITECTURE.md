# Architecture

Code-Bhumi remains a React, TypeScript, Vite, and Chrome Manifest V3 extension. Vite produces the popup, content-script bundle, service worker, manifest, and icons in `dist/`.

The LeetCode content script extracts the visible problem statement and editor lines, renders the existing chat surface, and delegates inference to `ModalService`. Providers implement the same modal contract, so the content UI does not depend on Ollama-specific details. The new Ollama provider uses `GET /api/tags` for discovery and `POST /api/chat` with `stream: false` and `format: "json"` for validated learning output. The request layer applies a 45-second timeout, abort propagation, a context-size cap, and Zod validation.

The popup stores only provider settings in `chrome.storage.local`. Chat history stays in the existing IndexedDB store and is scoped by problem slug. No backend is required for local inference.
