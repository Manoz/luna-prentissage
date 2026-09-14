import Anthropic from '@anthropic-ai/sdk'

/**
 * Streams the tutor's answer as server-sent events. Each event carries a JSON
 * payload: {type: "delta", text}, {type: "done"} or {type: "error", message}.
 * Validation and rate-limit failures are regular HTTP errors sent before the
 * stream opens.
 */
export default defineEventHandler(async (event) => {
  const client = getTutorClient()
  assertTutorNotRateLimited(event)

  const messages = validateTutorInput(await readBody(event))
  const system = await buildSystemPrompt()

  recordTutorMessage(event)

  const eventStream = createEventStream(event)
  const send = (payload: Record<string, unknown>) => eventStream.push(JSON.stringify(payload))

  const run = async () => {
    try {
      const stream = client.messages.stream({
        model: TUTOR_MODEL,
        max_tokens: 1024,
        output_config: { effort: 'low' },
        system,
        messages,
      })

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          await send({ type: 'delta', text: chunk.delta.text })
        }
      }

      const final = await stream.finalMessage()
      const { input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens } =
        final.usage
      console.info(
        `[tutor] in=${input_tokens} out=${output_tokens} cache_read=${cache_read_input_tokens ?? 0} cache_write=${cache_creation_input_tokens ?? 0} stop=${final.stop_reason}`,
      )
      if (final.stop_reason === 'refusal') {
        await send({
          type: 'delta',
          text: 'Je ne peux pas répondre à cette demande. Posez-moi une question sur la terminologie médicale.',
        })
      }
      await send({ type: 'done' })
    } catch (error) {
      await send({ type: 'error', message: describeTutorError(error) })
    } finally {
      await eventStream.close()
    }
  }

  void run()
  return eventStream.send()
})

function describeTutorError(error: unknown): string {
  if (error instanceof Anthropic.RateLimitError) {
    return 'Le tuteur est très sollicité en ce moment. Réessayez dans un instant.'
  }
  if (error instanceof Anthropic.AuthenticationError) {
    console.error('[tutor] invalid ANTHROPIC_API_KEY')
    return 'Le tuteur est momentanément indisponible.'
  }
  if (error instanceof Anthropic.APIError) {
    console.error(`[tutor] API error ${error.status}: ${error.message}`)
    return 'Le tuteur est momentanément indisponible.'
  }
  console.error('[tutor] unexpected error', error)
  return 'Une erreur est survenue. Réessayez.'
}
