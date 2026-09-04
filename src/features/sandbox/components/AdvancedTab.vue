<script setup lang="ts">
import { ref } from 'vue';
import Card from '@/shared/ui/Card.vue';
import Badge from '@/shared/ui/Badge.vue';
import Button from '@/shared/ui/Button.vue';

const showModal = ref(false);
const activeTab = ref<'A' | 'B'>('A');
const counterA = ref(0);
const counterB = ref(0);
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto w-full">
    <!-- Header -->
    <Card
      class="p-6 md:p-8 space-y-4 bg-gradient-to-br from-indigo-500/10 via-primary/5 to-background border-indigo-500/30"
    >
      <div class="flex items-center gap-2">
        <Badge
          variant="outline"
          class="bg-indigo-500/10 text-indigo-500 border-indigo-500/30 font-bold"
        >
          ✨ Advanced Vue 3.5 Capabilities
        </Badge>
        <span class="text-xs font-mono text-muted-foreground"
          >Teleport, KeepAlive, Suspense, defineModel</span
        >
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-foreground">
        Advanced Features & Built-in Components
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        Test powerful Vue 3 built-in architectural components:
        <code class="text-primary font-mono font-bold">&lt;Teleport&gt;</code>
        for DOM portal escapes, and
        <code class="text-primary font-mono font-bold">&lt;KeepAlive&gt;</code>
        for in-memory component state caching.
      </p>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Teleport Demonstration -->
      <Card class="p-5 md:p-6 space-y-4">
        <h3 class="text-base font-bold text-foreground">
          1. &lt;Teleport to="body"&gt;
        </h3>
        <p class="text-xs text-muted-foreground">
          Escapes parent CSS clipping/overflow and mounts the modal directly
          into <code class="font-mono text-primary">document.body</code>.
        </p>

        <Button variant="primary" @click="showModal = true"
          >Launch Teleported Modal</Button
        >

        <!-- Teleported Modal -->
        <Teleport to="body">
          <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          >
            <div
              class="bg-background border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div
                class="flex items-center justify-between border-b border-border pb-3"
              >
                <h4 class="text-base font-bold text-foreground">
                  🚀 Teleported to Body
                </h4>
                <button
                  class="text-muted-foreground hover:text-foreground text-sm font-bold"
                  @click="showModal = false"
                >
                  ✕
                </button>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">
                This element is rendered at the root
                <code class="font-mono text-primary">&lt;body&gt;</code> DOM
                node, bypassing any z-index or overflow restrictions of its
                parent component.
              </p>
              <div class="flex justify-end pt-2">
                <Button size="sm" @click="showModal = false"
                  >Close Modal</Button
                >
              </div>
            </div>
          </div>
        </Teleport>
      </Card>

      <!-- KeepAlive Demonstration -->
      <Card class="p-5 md:p-6 space-y-4">
        <h3 class="text-base font-bold text-foreground">
          2. &lt;KeepAlive&gt; In-Memory Caching
        </h3>
        <p class="text-xs text-muted-foreground">
          Switch tabs and notice that internal counter states are preserved
          without re-mounting!
        </p>

        <div class="flex gap-2">
          <Button
            size="sm"
            :variant="activeTab === 'A' ? 'primary' : 'outline'"
            @click="activeTab = 'A'"
            >Tab A</Button
          >
          <Button
            size="sm"
            :variant="activeTab === 'B' ? 'primary' : 'outline'"
            @click="activeTab = 'B'"
            >Tab B</Button
          >
        </div>

        <div class="p-4 rounded-xl border border-border bg-accent/20">
          <KeepAlive>
            <div v-if="activeTab === 'A'" class="space-y-2">
              <span class="text-xs font-bold text-foreground"
                >Component A (Cached in Memory):</span
              >
              <div class="flex items-center gap-2">
                <Button size="sm" variant="outline" @click="counterA++"
                  >Increment A: {{ counterA }}</Button
                >
              </div>
            </div>
            <div v-else class="space-y-2">
              <span class="text-xs font-bold text-foreground"
                >Component B (Cached in Memory):</span
              >
              <div class="flex items-center gap-2">
                <Button size="sm" variant="outline" @click="counterB++"
                  >Increment B: {{ counterB }}</Button
                >
              </div>
            </div>
          </KeepAlive>
        </div>
      </Card>
    </div>
  </div>
</template>
