<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect } from 'vue';
import Card from '@/shared/ui/Card.vue';
import Badge from '@/shared/ui/Badge.vue';
import Button from '@/shared/ui/Button.vue';

// 1. Ref & Reactive State
const count = ref(10);
const multiplier = ref(2);
const userProfile = reactive({
  name: 'Alex Developer',
  role: 'Senior Architect',
  level: 4
});

// 2. Computed Values
const computedTotal = computed(() => count.value * multiplier.value);
const formattedProfile = computed(
  () => `${userProfile.name} (${userProfile.role}, Lvl ${userProfile.level})`
);

// 3. Writable Computed
const discountPercent = ref(15);
const finalPrice = computed({
  get: () =>
    Math.round(computedTotal.value * (1 - discountPercent.value / 100)),
  set: (newFinal: number) => {
    if (computedTotal.value > 0) {
      discountPercent.value = Math.max(
        0,
        Math.round((1 - newFinal / computedTotal.value) * 100)
      );
    }
  }
});

// 4. Watcher Logs
const watchLog = ref<string[]>([]);
watch(count, (newVal, oldVal) => {
  watchLog.value.unshift(`[watch count] Changed from ${oldVal} to ${newVal}`);
  if (watchLog.value.length > 5) watchLog.value.pop();
});

watchEffect(() => {
  const currentTotal = count.value * multiplier.value;
  watchLog.value.unshift(
    `[watchEffect] Auto-tracked live total: $${currentTotal}`
  );
  if (watchLog.value.length > 5) watchLog.value.pop();
});
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto w-full">
    <!-- Header -->
    <Card
      class="p-6 md:p-8 space-y-4 bg-gradient-to-br from-blue-500/10 via-primary/5 to-background border-blue-500/30"
    >
      <div class="flex items-center gap-2">
        <Badge
          variant="outline"
          class="bg-blue-500/10 text-blue-500 border-blue-500/30 font-bold"
        >
          ⚡ Vue 3.5 Reactivity Engine
        </Badge>
        <span class="text-xs font-mono text-muted-foreground"
          >Proxy-Based Fine-Grained Signals</span
        >
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-foreground">
        Composition API & Reactivity Lab
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        Test reactive primitives in real time:
        <code class="text-primary font-mono font-bold">ref()</code>,
        <code class="text-primary font-mono font-bold">reactive()</code>, pure
        and writable
        <code class="text-primary font-mono font-bold">computed()</code>, and
        reactive side-effects via
        <code class="text-primary font-mono font-bold">watch()</code> &
        <code class="text-primary font-mono font-bold">watchEffect()</code>.
      </p>
    </Card>

    <!-- Interactive Interactive Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Ref & Computed Section -->
      <Card class="p-5 md:p-6 space-y-4">
        <h3 class="text-base font-bold text-foreground flex items-center gap-2">
          <span>🔢 Ref & Computed Derivations</span>
        </h3>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground"
              >Base Value (<code class="font-mono">count</code>):</span
            >
            <div class="flex items-center gap-2">
              <Button size="sm" variant="outline" @click="count--">-1</Button>
              <span
                class="font-mono font-black text-sm text-foreground w-8 text-center"
                >{{ count }}</span
              >
              <Button size="sm" variant="outline" @click="count++">+1</Button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground"
              >Multiplier (<code class="font-mono">multiplier</code>):</span
            >
            <div class="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                @click="multiplier = Math.max(1, multiplier - 1)"
                >-</Button
              >
              <span
                class="font-mono font-black text-sm text-foreground w-8 text-center"
                >{{ multiplier }}x</span
              >
              <Button size="sm" variant="outline" @click="multiplier++"
                >+</Button
              >
            </div>
          </div>

          <div
            class="p-3 bg-accent/30 rounded-xl border border-border flex items-center justify-between"
          >
            <span class="text-xs font-bold text-foreground"
              >Computed Total (<code class="font-mono">count * multiplier</code
              >):</span
            >
            <span class="font-mono font-black text-primary text-base"
              >${{ computedTotal }}</span
            >
          </div>

          <div
            class="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between"
          >
            <span
              class="text-xs font-bold text-emerald-600 dark:text-emerald-400"
              >Writable Computed Final Price ({{ discountPercent }}% off):</span
            >
            <span
              class="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base"
              >${{ finalPrice }}</span
            >
          </div>
        </div>
      </Card>

      <!-- Reactive Object & Watchers Section -->
      <Card class="p-5 md:p-6 space-y-4">
        <h3 class="text-base font-bold text-foreground flex items-center gap-2">
          <span>📦 Reactive Proxy & Live Watchers</span>
        </h3>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground"
              >Role Level (<code class="font-mono">userProfile.level</code
              >):</span
            >
            <div class="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                @click="userProfile.level = Math.max(1, userProfile.level - 1)"
                >-</Button
              >
              <span
                class="font-mono font-black text-sm text-foreground w-8 text-center"
                >Lvl {{ userProfile.level }}</span
              >
              <Button size="sm" variant="outline" @click="userProfile.level++"
                >+</Button
              >
            </div>
          </div>

          <div class="p-3 bg-accent/30 rounded-xl border border-border">
            <span class="text-xs font-mono text-muted-foreground">{{
              formattedProfile
            }}</span>
          </div>

          <!-- Watch Log Output -->
          <div class="space-y-1.5 pt-1">
            <span
              class="text-[11px] font-bold text-muted-foreground uppercase font-mono"
              >Live Watcher Execution Log:</span
            >
            <div
              class="p-3 bg-zinc-950 dark:bg-black/90 rounded-xl border border-zinc-800 font-mono text-[11px] text-emerald-400 space-y-1 max-h-32 overflow-y-auto"
            >
              <div v-for="(log, idx) in watchLog" :key="idx" class="truncate">
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
