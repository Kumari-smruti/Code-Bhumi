# Contributing

Please open an issue before large changes. Keep provider-specific code behind the modal/provider abstraction, preserve local-first behavior, and never add automatic execution of user or model-generated code.

Before opening a pull request, run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. Do not commit `.env` files, API keys, generated `dist/` output, or private problem data. Update documentation when provider behavior, permissions, model tags, or privacy boundaries change.
