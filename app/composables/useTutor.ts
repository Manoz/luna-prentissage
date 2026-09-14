export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
}

type StreamPayload =
  { type: 'delta'; text: string } | { type: 'done' } | { type: 'error'; message: string }

const GENERIC_ERROR = 'Une erreur est survenue. Réessayez.'

/**
 * Conversation with the AI tutor. The history lives in shared state for the
 * session; the server keeps only the most recent turns.
 */
export function useTutor() {
  const messages = useState<TutorMessage[]>('tutor-messages', () => [])
  const pending = useState('tutor-pending', () => false)
  const error = useState<string | null>('tutor-error', () => null)

  async function send(content: string) {
    const text = content.trim()
    if (!text || pending.value) return

    error.value = null
    pending.value = true
    messages.value = [...messages.value, { role: 'user', content: text }]

    const history = messages.value
    const assistantIndex = history.length
    messages.value = [...history, { role: 'assistant', content: '' }]

    const append = (delta: string) => {
      const next = [...messages.value]
      const current = next[assistantIndex]
      if (current) next[assistantIndex] = { ...current, content: current.content + delta }
      messages.value = next
    }

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ messages: history }),
      })

      if (!response.ok || !response.body) {
        throw new Error(await readHttpError(response))
      }

      await readEventStream(response.body, (payload) => {
        if (payload.type === 'delta') append(payload.text)
        else if (payload.type === 'error') throw new Error(payload.message)
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : GENERIC_ERROR
      // Drop the empty assistant bubble so the user can retry cleanly
      messages.value = messages.value.filter(
        (message, index) => !(index === assistantIndex && message.content === ''),
      )
    } finally {
      pending.value = false
    }
  }

  function reset() {
    messages.value = []
    error.value = null
  }

  return {
    messages: readonly(messages),
    pending: readonly(pending),
    error: readonly(error),
    send,
    reset,
  }
}

async function readHttpError(response: Response): Promise<string> {
  if (response.status === 429) {
    try {
      const body = await response.json()
      if (typeof body?.message === 'string') return body.message
    } catch {
      // fall through
    }
    return 'Trop de questions en peu de temps. Réessayez dans quelques minutes.'
  }
  if (response.status === 503) return 'Le tuteur n’est pas disponible pour le moment.'
  return GENERIC_ERROR
}

/** Parses "data: <json>" server-sent events from a fetch body. */
async function readEventStream(
  body: ReadableStream<Uint8Array>,
  onPayload: (payload: StreamPayload) => void,
) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary = buffer.indexOf('\n\n')
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      for (const line of block.split('\n')) {
        if (line.startsWith('data:')) {
          onPayload(JSON.parse(line.slice(5).trim()) as StreamPayload)
        }
      }
      boundary = buffer.indexOf('\n\n')
    }
  }
}
