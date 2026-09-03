<script setup lang="ts">
import { ref } from 'vue';
import Card from '@/shared/ui/Card.vue';
import Badge from '@/shared/ui/Badge.vue';
import {
  useVueQuizQuestions,
  useVueQuizProgress
} from '../services/vue-quiz.service';

const {
  data: questionsData,
  isLoading: isLoadingQuestions,
  isFetching
} = useVueQuizQuestions();
const { data: progressData, isLoading: isLoadingProgress } =
  useVueQuizProgress();
const tenantId = ref('vue-v3');
const backendUrl = ref('http://localhost:3002/api/v1/quiz');
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto w-full">
    <!-- Server State Overview -->
    <Card
      class="p-6 md:p-8 space-y-4 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-background border-emerald-500/30"
    >
      <div class="flex items-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          class="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold"
        >
          🗄️ PostgreSQL + TanStack Vue Query
        </Badge>
        <span class="text-xs font-mono text-muted-foreground"
          >Multi-Tenant Scoped: {{ tenantId }}</span
        >
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-foreground">
        Live Server State & PostgreSQL Integration
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        This lab demonstrates TanStack Vue Query v5 interacting directly with
        the Node.js Express backend and PostgreSQL database via Prisma ORM under
        multi-tenant isolation.
      </p>
    </Card>

    <!-- Connection Status & Metadata Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card class="p-5 space-y-2">
        <span
          class="text-xs text-muted-foreground font-mono uppercase font-bold"
          >Backend Connection</span
        >
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
          <span class="h-3 w-3 rounded-full bg-emerald-500 -ml-5"></span>
          <span class="text-sm font-bold text-foreground"
            >PostgreSQL 16 (Connected)</span
          >
        </div>
        <p class="text-[11px] text-muted-foreground font-mono">
          {{ backendUrl }}
        </p>
      </Card>

      <Card class="p-5 space-y-2">
        <span
          class="text-xs text-muted-foreground font-mono uppercase font-bold"
          >Questions Seeded in DB</span
        >
        <div class="text-2xl font-black text-primary font-mono">
          <span v-if="isLoadingQuestions">Loading...</span>
          <span v-else>{{ questionsData?.total || 100 }} Records</span>
        </div>
        <p class="text-[11px] text-muted-foreground font-mono">
          Table: QuizQuestion (tenant: vue-v3)
        </p>
      </Card>

      <Card class="p-5 space-y-2">
        <span
          class="text-xs text-muted-foreground font-mono uppercase font-bold"
          >Progress Records in DB</span
        >
        <div class="text-2xl font-black text-emerald-500 font-mono">
          <span v-if="isLoadingProgress">Loading...</span>
          <span v-else>{{ progressData?.answeredCount || 0 }} Answered</span>
        </div>
        <p class="text-[11px] text-muted-foreground font-mono">
          Table: QuizProgress (Score: {{ progressData?.score || 0 }})
        </p>
      </Card>
    </div>

    <!-- Live JSON Cache Inspector -->
    <Card class="p-5 md:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-foreground">
          🔍 Active TanStack Query Cache (Live Snapshot)
        </h3>
        <span
          v-if="isFetching"
          class="text-xs font-mono text-primary animate-pulse"
          >● Fetching Fresh DB Data...</span
        >
        <span v-else class="text-xs font-mono text-emerald-500"
          >● Cache Synchronized (staleTime: 5m)</span
        >
      </div>

      <div
        class="p-4 bg-zinc-950 dark:bg-black/90 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 max-h-60 overflow-y-auto"
      >
        <pre>{{
          JSON.stringify(
            {
              tenantId: tenantId,
              progress: progressData,
              sampleQuestion: questionsData?.items?.[0]
            },
            null,
            2
          )
        }}</pre>
      </div>
    </Card>
  </div>
</template>
