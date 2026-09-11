<template>
  <div class="flex min-h-screen flex-col">
    <header
      class="flex h-13 items-center justify-between gap-4 border-b border-line px-5 text-[13px] sm:px-7"
    >
      <p class="text-ink-soft">Tuteur</p>
      <button
        v-if="messages.length > 0"
        type="button"
        class="btn-ghost -mr-2"
        :disabled="pending"
        @click="reset"
      >
        Nouvelle conversation
      </button>
    </header>

    <main class="flex flex-1 flex-col px-5 py-8 sm:px-7 lg:px-14">
      <div class="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <!-- Intro and starters -->
        <div v-if="messages.length === 0">
          <p class="kicker mb-2">Tuteur</p>
          <h1 class="text-3xl font-semibold tracking-tight">Posez une question sur un terme</h1>
          <p class="mt-2 text-sm text-ink-soft">
            Le tuteur explique les radicaux, préfixes et suffixes de l'application, décompose des
            mots et propose des exercices. Il ne répond qu'à ce sujet. Ses réponses sont générées
            par une IA et peuvent contenir des erreurs.
          </p>
          <ul class="mt-6 flex flex-col gap-1.5">
            <li v-for="starter in starters" :key="starter">
              <button type="button" class="row" @click="send(starter)">
                <span>{{ starter }}</span>
                <span class="text-ink-faint" aria-hidden="true">→</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Thread -->
        <ol v-else class="flex flex-col gap-6" aria-label="Conversation">
          <li v-for="(message, index) in messages" :key="index">
            <p class="kicker mb-1.5">{{ message.role === 'user' ? 'Vous' : 'Tuteur' }}</p>
            <div
              class="text-[15px] leading-relaxed whitespace-pre-wrap"
              :class="message.role === 'user' ? 'text-ink' : 'text-ink-2'"
            >
              {{ message.content }}
              <span
                v-if="message.role === 'assistant' && message.content === '' && pending"
                class="text-ink-faint"
                >…</span
              >
            </div>
          </li>
        </ol>
        <p class="sr-only" aria-live="polite">{{ liveStatus }}</p>

        <p v-if="error" role="alert" class="mt-6 text-sm text-danger">{{ error }}</p>

        <form
          class="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-line bg-paper pt-4 pb-2"
          @submit.prevent="submit"
        >
          <label for="tutor-input" class="sr-only">Votre question</label>
          <div class="flex gap-2">
            <textarea
              id="tutor-input"
              ref="inputRef"
              v-model="draft"
              rows="2"
              maxlength="1000"
              class="field resize-none"
              placeholder="Par exemple : que signifie -ectomie ?"
              :disabled="pending"
              @keydown.enter.exact.prevent="submit"
            />
            <button type="submit" class="btn-primary self-end" :disabled="pending || !draft.trim()">
              Envoyer
            </button>
          </div>
          <p class="hint">Entrée pour envoyer, Maj + Entrée pour un retour à la ligne.</p>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { messages, pending, error, send, reset } = useTutor()
const route = useRoute()
const router = useRouter()

const draft = ref('')
const inputRef = ref<HTMLTextAreaElement | null>(null)

const starters = [
  'Que signifie -ectomie ?',
  'Décompose le mot « gastro-entérologie »',
  'Donne-moi trois mots qui contiennent cardio-',
  'Fais-moi un petit quiz sur les couleurs',
]

const liveStatus = computed(() => {
  if (pending.value) return 'Le tuteur répond…'
  const last = messages.value[messages.value.length - 1]
  return last?.role === 'assistant' ? 'Réponse du tuteur reçue' : ''
})

function submit() {
  const text = draft.value
  draft.value = ''
  send(text)
  nextTick(() => inputRef.value?.focus())
}

// A question can be handed over from another page (?q=...)
onMounted(() => {
  const q = route.query.q
  if (typeof q === 'string' && q.trim()) {
    router.replace({ query: {} })
    send(q)
  }
})
</script>
