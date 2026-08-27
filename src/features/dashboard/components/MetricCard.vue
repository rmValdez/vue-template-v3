<script setup lang="ts">
import { type Component } from 'vue';
import { Card, CardContent } from '@/shared/ui';
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';

defineProps<{
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: Component;
  format?: 'currency' | 'number' | 'percent';
}>();
</script>

<template>
  <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {{ title }}
        </span>
        <div
          v-if="icon"
          class="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
        >
          <component :is="icon" class="h-4 w-4" />
        </div>
      </div>

      <div class="mt-4 space-y-1">
        <div class="text-2xl font-extrabold tracking-tight text-foreground">
          {{ value }}
        </div>

        <div v-if="change !== undefined" class="flex items-center gap-1.5 text-xs font-medium">
          <span
            :class="[
              change >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10',
              'inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold'
            ]"
          >
            <ArrowUpRight v-if="change >= 0" class="h-3 w-3 mr-0.5" />
            <ArrowDownRight v-else class="h-3 w-3 mr-0.5" />
            {{ Math.abs(change) }}%
          </span>
          <span class="text-muted-foreground">{{ changeLabel || 'vs last month' }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
