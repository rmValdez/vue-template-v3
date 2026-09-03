<script setup lang="ts">
import Card from '@/shared/ui/Card.vue';
import Badge from '@/shared/ui/Badge.vue';
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto w-full">
    <!-- Header Banner -->
    <Card
      class="p-6 md:p-8 space-y-4 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-background border-emerald-500/30"
    >
      <div class="flex items-center gap-2">
        <Badge
          variant="outline"
          class="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold"
        >
          🏛️ Engineering Manual
        </Badge>
        <span class="text-xs font-mono text-muted-foreground"
          >Vue 3.5 • Composition API • Enterprise</span
        >
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-foreground">
        Vue 3.5 Enterprise Architecture & Quiz Solver Guide
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        This living architecture guide documents the core engineering patterns,
        directory boundaries, and decision matrices required to master Vue 3.5
        project development and answer all 100 scenario questions.
      </p>
    </Card>

    <!-- 10 Pillars Accordion / Card Deck -->
    <div class="space-y-4">
      <!-- Pillar 1: FAOS -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-500 font-mono font-black text-xs flex items-center justify-center"
            >1</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Feature-Atomic Architecture (FAOS) & Boundary Isolation
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Application code is partitioned strictly into isolated business
          feature modules (<code class="text-primary font-mono font-bold"
            >src/features/*</code
          >). Cross-feature imports are prohibited to guarantee zero circular
          dependencies and allow features to be deleted or refactored
          independently.
        </p>
        <div
          class="p-3.5 bg-zinc-950 dark:bg-black/90 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto"
        >
          <pre>
src/features/users/
├── components/     # Feature-only UI (UserCard.vue, UserFilter.vue)
├── composables/    # Domain state & logic (useUsers.ts)
├── services/       # Feature API integration
└── views/          # Routable screens (UsersView.vue)</pre>
        </div>
      </Card>

      <!-- Pillar 2: Clean Composables -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-blue-500/20 text-blue-500 font-mono font-black text-xs flex items-center justify-center"
            >2</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Clean Composables (<code class="text-primary font-mono">useXxx</code
            >) Design Rules
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Composables encapsulate stateful logic using Vue\'s Composition API.
          They should accept flexible arguments (plain values, refs, or getters
          normalized via <code class="text-primary font-mono">toRef()</code> /
          <code class="text-primary font-mono">toValue()</code>) and return
          plain objects of refs and methods.
        </p>
        <div
          class="p-3.5 bg-zinc-950 dark:bg-black/90 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto"
        >
          <pre>
// Composable Convention:
export function useCounter(initial = 0) {
  const count = ref(initial);
  const double = computed(() => count.value * 2);
  function increment() { count.value++; }
  return { count, double, increment };
}</pre>
        </div>
      </Card>

      <!-- Pillar 3: Pinia Setup Stores -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-purple-500/20 text-purple-500 font-mono font-black text-xs flex items-center justify-center"
            >3</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Pinia Setup Stores vs Component-Local State
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Pinia Setup Stores (<code class="text-primary font-mono"
            >defineStore('id', () =&gt; &#123; ... &#125;)</code
          >) are used for app-wide global domain state (e.g. authenticated user,
          active tenant). Always destructure reactive state using
          <code class="text-primary font-mono">storeToRefs(store)</code>. Keep
          transient UI state (e.g. dropdown toggles) local to the component
          using <code class="text-primary font-mono">ref(false)</code>.
        </p>
      </Card>

      <!-- Pillar 4: Vue Router & Lazy Chunking -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-500 font-mono font-black text-xs flex items-center justify-center"
            >4</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Vue Router Navigation Guards & Lazy Chunking
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          All routable views must be lazy-loaded using dynamic import syntax:
          <code class="text-primary font-mono"
            >component: () =&gt; import('./View.vue')</code
          >. Route authentication and RBAC permissions are enforced in
          <code class="text-primary font-mono"
            >router.beforeEach(authGuard)</code
          >
          before views are mounted.
        </p>
      </Card>

      <!-- Pillar 5: Server State with TanStack Vue Query -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-teal-500/20 text-teal-500 font-mono font-black text-xs flex items-center justify-center"
            >5</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Server State with TanStack Vue Query
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Server state is asynchronous, cached, and owned remotely. Do not
          duplicate API data in Pinia stores; manage it using TanStack Query
          (<code class="text-primary font-mono">useQuery</code>,
          <code class="text-primary font-mono">useMutation</code>) with
          background revalidation, query key caching, and automatic
          invalidation.
        </p>
      </Card>

      <!-- Pillar 6: High Performance & Vue 3.5 Features -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-rose-500/20 text-rose-500 font-mono font-black text-xs flex items-center justify-center"
            >6</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Performance Optimization:
            <code class="text-primary font-mono">shallowRef</code>,
            <code class="text-primary font-mono">v-memo</code> & Vue 3.5 Engine
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Use <code class="text-primary font-mono">shallowRef</code> for large
          immutable datasets or external 3rd-party library instances to avoid
          deep Proxy overhead. Use
          <code class="text-primary font-mono">v-memo</code> for massive table
          rows and
          <code class="text-primary font-mono">defineAsyncComponent</code> for
          heavy charts.
        </p>
      </Card>

      <!-- Pillar 7: Security & Auth Cookies -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-500 font-mono font-black text-xs flex items-center justify-center"
            >7</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Security: HTTP-Only Cookies, XSS Protection & CORS
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Session tokens are transported via HTTP-Only, Secure, SameSite cookies
          to protect against XSS token theft. Never bind untrusted user input to
          <code class="text-primary font-mono">v-html</code> without DOMPurify
          sanitization. Ensure backend CORS middleware allowlists the
          <code class="text-primary font-mono">x-tenant-id</code> header.
        </p>
      </Card>

      <!-- Pillar 8: Testing Strategy -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-500 font-mono font-black text-xs flex items-center justify-center"
            >8</span
          >
          <h3 class="text-lg font-bold text-foreground">
            Testing Strategy: Vitest &
            <code class="text-primary font-mono">@vue/test-utils</code>
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Test components in isolation using
          <code class="text-primary font-mono"
            >mount(Component, &#123; props &#125;)</code
          >. Await event triggers (<code class="text-primary font-mono"
            >await wrapper.find('button').trigger('click')</code
          >) to allow Vue\'s asynchronous DOM patch queue to flush before
          running assertions.
        </p>
      </Card>

      <!-- Pillar 9: TypeScript & Vue 3.5 Compiler Macros -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-emerald-600/20 text-emerald-600 font-mono font-black text-xs flex items-center justify-center"
            >9</span
          >
          <h3 class="text-lg font-bold text-foreground">
            TypeScript Strictness & Vue 3.5 Macros
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Leverage Vue 3.5 **Reactive Props Destructuring** (<code
            class="text-primary font-mono"
            >const &#123; count = 0 &#125; = defineProps&lt;Props&gt;()</code
          >),
          <code class="text-primary font-mono">defineEmits&lt;Emits&gt;()</code
          >, <code class="text-primary font-mono">defineModel&lt;T&gt;()</code>,
          and
          <code class="text-primary font-mono">useTemplateRef&lt;T&gt;()</code>
          for maximum type safety.
        </p>
      </Card>

      <!-- Pillar 10: SSR Readiness & Nuxt 3 Migration -->
      <Card class="p-5 md:p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="h-6 w-6 rounded-lg bg-orange-500/20 text-orange-500 font-mono font-black text-xs flex items-center justify-center"
            >10</span
          >
          <h3 class="text-lg font-bold text-foreground">
            SSR Readiness & Nuxt 3 Migration Path
          </h3>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed">
          Avoid referencing browser globals (<code
            class="text-primary font-mono"
            >window</code
          >, <code class="text-primary font-mono">document</code>,
          <code class="text-primary font-mono">localStorage</code>) directly in
          component setup; wrap browser-specific code inside
          <code class="text-primary font-mono">onMounted()</code> to ensure
          painless transition to Server-Side Rendering (SSR) in Nuxt 3.
        </p>
      </Card>
    </div>
  </div>
</template>
