<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dataPoints = [35, 48, 42, 60, 58, 75, 82, 90, 85, 95, 110, 125];

const hoveredIndex = ref<number | null>(null);
const maxVal = Math.max(...dataPoints);
</script>

<template>
  <Card className="col-span-full lg:col-span-2">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>System Performance &amp; Traffic</CardTitle>
          <CardDescription>Monthly transaction volume and API activity</CardDescription>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Live Telemetry
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="h-64 w-full flex flex-col justify-end pt-4">
        <!-- Interactive Bars Chart -->
        <div class="flex-1 flex items-end gap-2 md:gap-4 px-2">
          <div
            v-for="(val, idx) in dataPoints"
            :key="idx"
            class="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
            @mouseenter="hoveredIndex = idx"
            @mouseleave="hoveredIndex = null"
          >
            <!-- Tooltip -->
            <div
              class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-foreground text-background transition-all duration-150 pointer-events-none"
              :class="[hoveredIndex === idx ? 'opacity-100 -translate-y-1' : 'opacity-0']"
            >
              {{ val }}k
            </div>

            <!-- Bar -->
            <div
              class="w-full rounded-t-md transition-all duration-300 relative overflow-hidden"
              :style="{ height: `${(val / maxVal) * 80}%` }"
              :class="[
                hoveredIndex === idx
                  ? 'bg-gradient-to-t from-primary via-emerald-400 to-teal-300 shadow-lg shadow-primary/30 scale-x-105'
                  : 'bg-primary/20 hover:bg-primary/40'
              ]"
            ></div>

            <!-- Month Label -->
            <span
              class="text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-foreground"
            >
              {{ months[idx] }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
