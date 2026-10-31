import React from 'react'
import { Activity, ExternalLink, Github, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChromeStorage } from '@/hooks/useChromeStorage'
import { OllamaClient, normalizeEndpoint, parseOllamaConfig } from '@/providers/ollama'

const DEFAULT_ENDPOINT = 'http://localhost:11434'

type Status = { kind: 'idle' | 'checking' | 'success' | 'error'; message: string }

const Popup: React.FC = () => {
  const storage = useChromeStorage()
  const [endpoint, setEndpoint] = React.useState(DEFAULT_ENDPOINT)
  const [model, setModel] = React.useState('qwen3:4b')
  const [availableModels, setAvailableModels] = React.useState<string[]>([])
  const [status, setStatus] = React.useState<Status>({ kind: 'idle', message: 'Not checked yet' })
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    storage.getKeyModel('ollama').then((result) => {
      if (!mounted) return
      const config = parseOllamaConfig(result.apiKey)
      setEndpoint(config.endpoint)
      setModel(config.model)
    }).catch(() => undefined)
    return () => { mounted = false }
  }, [])

  const checkConnection = async () => {
    setStatus({ kind: 'checking', message: 'Checking local Ollama…' })
    const client = new OllamaClient({ endpoint: normalizeEndpoint(endpoint), model })
    const result = await client.checkConnection()
    if (result.connected) {
      const models = await client.listModels().catch(() => [])
      setAvailableModels(models.map((entry) => entry.name))
      setStatus({ kind: 'success', message: `${models.length} installed model${models.length === 1 ? '' : 's'}` })
    } else {
      setAvailableModels([])
      setStatus({ kind: 'error', message: result.message })
    }
  }

  const saveSettings = async () => {
    await storage.setKeyModel(JSON.stringify({ endpoint: normalizeEndpoint(endpoint), model }), 'ollama')
    await storage.setSelectModel('ollama')
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  const localReady = status.kind === 'success' && availableModels.includes(model)

  return (
    <main className="popup-shell">
      <header className="brand-row">
        <div className="brand-mark"><Sparkles size={17} /></div>
        <div>
          <p className="eyebrow">LOCAL-FIRST AI MENTOR</p>
          <h1>Code<span>Bhumi</span></h1>
        </div>
        <a className="icon-link" href="https://github.com/Ronit-paikray/Code-Bhumi" target="_blank" rel="noreferrer" aria-label="Open GitHub"><Github size={16} /></a>
      </header>

      <section className="hero-card">
        <div>
          <p className="hero-kicker">LEARN TO THINK</p>
          <h2>Hints before answers.</h2>
          <p>Progressive guidance for LeetCode, powered by your own local model.</p>
        </div>
        <ShieldCheck className="hero-icon" size={32} />
      </section>

      <section className="panel">
        <div className="panel-heading"><div><p className="section-label">MODEL CONNECTION</p><h3>Ollama workspace</h3></div><span className={`status-dot ${status.kind}`} /></div>
        <label>Endpoint<input value={endpoint} onChange={(event) => setEndpoint(event.target.value)} placeholder={DEFAULT_ENDPOINT} /></label>
        <label>Installed model<input value={model} onChange={(event) => setModel(event.target.value)} placeholder="qwen3:4b" /></label>
        {availableModels.length > 0 && <p className="model-hint">Detected: {availableModels.join(' · ')}</p>}
        <div className="action-row">
          <Button variant="secondary" onClick={checkConnection} disabled={status.kind === 'checking'}><RefreshCw size={15} className={status.kind === 'checking' ? 'spin' : ''} /> Check connection</Button>
          <Button onClick={saveSettings}>{saved ? 'Saved' : 'Save settings'}</Button>
        </div>
        <div className={`status-box ${status.kind}`}><Activity size={15} /><span>{status.message}{localReady ? ' · selected model is ready' : ''}</span></div>
      </section>

      <section className="tip-card"><p><strong>Privacy by default.</strong> Code and problem context stay on this device when using Ollama. Cloud providers remain available as legacy options.</p><a href="https://ollama.com/download" target="_blank" rel="noreferrer">Install Ollama <ExternalLink size={13} /></a></section>
      <footer><span>v2.0 · Open-weight edition</span><a href="https://github.com/Ronit-paikray/Code-Bhumi/issues" target="_blank" rel="noreferrer">Give feedback</a></footer>
    </main>
  )
}

export default Popup
