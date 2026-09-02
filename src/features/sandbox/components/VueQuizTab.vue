<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Card from '@/shared/ui/Card.vue';
import Badge from '@/shared/ui/Badge.vue';
import { VUE_100_QUIZ_BANK, type VueQuizQuestion } from '../data/vue-quiz-questions.data';
import {
  useVueQuizQuestions,
  useVueQuizProgress,
  useSaveVueQuizProgress,
  useResetVueQuizProgress
} from '../services/vue-quiz.service';

const pageSize = 10;
const currentCategory = ref<string>('ALL');
const currentDifficulty = ref<string>('ALL');
const searchTerm = ref<string>('');
const currentPage = ref<number>(1);
const quizMode = ref<'ALL' | 'SPRINT_20'>('ALL');
const userAnswers = ref<Record<number, number>>({});

// TanStack Vue Query integration
const { data: queryData, isLoading } = useVueQuizQuestions(currentCategory, currentDifficulty, searchTerm);
const { data: progressData } = useVueQuizProgress();
const saveMutation = useSaveVueQuizProgress();
const resetMutation = useResetVueQuizProgress();

// Populate answers from PostgreSQL on load
watch(
  () => progressData.value,
  (data) => {
    if (data?.answers && typeof data.answers === 'object') {
      const parsed: Record<number, number> = {};
      for (const [k, v] of Object.entries(data.answers)) {
        parsed[Number(k)] = Number(v);
      }
      userAnswers.value = parsed;
    }
  },
  { immediate: true }
);

const categories = [
  'ALL',
  'FUNDAMENTALS',
  'REACTIVITY',
  'ARCHITECTURE',
  'ROUTING',
  'FORMS',
  'HTTP_QUERY',
  'PERFORMANCE',
  'TESTING',
  'SECURITY',
  'DEBUGGING'
];

const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const allQuestions = computed<VueQuizQuestion[]>(() => {
  if (queryData.value?.items && queryData.value.items.length > 0) {
    return queryData.value.items;
  }
  return VUE_100_QUIZ_BANK;
});

const displayQuestions = computed(() => {
  const list = allQuestions.value;
  if (quizMode.value === 'SPRINT_20') {
    return list.slice(0, 20);
  }
  return list;
});

const filteredQuestions = computed(() => {
  let list = displayQuestions.value;
  if (currentCategory.value !== 'ALL') {
    list = list.filter((q) => q.category === currentCategory.value);
  }
  if (currentDifficulty.value !== 'ALL') {
    list = list.filter((q) => q.difficulty === currentDifficulty.value);
  }
  const search = searchTerm.value.toLowerCase().trim();
  if (search) {
    list = list.filter(
      (q) =>
        q.question.toLowerCase().includes(search) ||
        q.explanation.toLowerCase().includes(search) ||
        (q.codeSnippet && q.codeSnippet.toLowerCase().includes(search)) ||
        q.options.some((opt) => opt.toLowerCase().includes(search))
    );
  }
  return list;
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredQuestions.value.length / pageSize));
});

const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredQuestions.value.slice(start, start + pageSize);
});

const answeredCount = computed(() => {
  const activeIds = new Set(displayQuestions.value.map((q) => q.id));
  return Object.keys(userAnswers.value).filter((id) => activeIds.has(Number(id))).length;
});

const quizScore = computed(() => {
  let correct = 0;
  for (const q of displayQuestions.value) {
    if (userAnswers.value[q.id] === q.correctIndex) {
      correct++;
    }
  }
  return correct;
});

const incorrectCount = computed(() => {
  let incorrect = 0;
  for (const q of displayQuestions.value) {
    if (userAnswers.value[q.id] !== undefined && userAnswers.value[q.id] !== q.correctIndex) {
      incorrect++;
    }
  }
  return incorrect;
});

const accuracyPercentage = computed(() => {
  if (answeredCount.value === 0) return 0;
  return Math.round((quizScore.value / answeredCount.value) * 100);
});

const progressPercentage = computed(() => {
  const total = displayQuestions.value.length;
  if (total === 0) return 0;
  return Math.round((answeredCount.value / total) * 100);
});

function selectCategory(cat: string) {
  currentCategory.value = cat;
  currentPage.value = 1;
}

function selectDifficulty(diff: string) {
  currentDifficulty.value = diff;
  currentPage.value = 1;
}

function setQuizMode(mode: 'ALL' | 'SPRINT_20') {
  quizMode.value = mode;
  currentPage.value = 1;
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

async function answerQuestion(questionId: number, optionIndex: number) {
  userAnswers.value = {
    ...userAnswers.value,
    [questionId]: optionIndex
  };

  // Sync to PostgreSQL QuizProgress table
  try {
    await saveMutation.mutateAsync({
      answers: userAnswers.value,
      score: quizScore.value,
      answeredCount: answeredCount.value
    });
  } catch (err) {
    console.error('Failed to persist answers in PostgreSQL', err);
  }
}

async function retakeQuestion(questionId: number) {
  const updated = { ...userAnswers.value };
  delete updated[questionId];
  userAnswers.value = updated;

  try {
    await saveMutation.mutateAsync({
      answers: updated,
      score: quizScore.value,
      answeredCount: answeredCount.value
    });
  } catch (err) {
    console.error('Failed to update progress in PostgreSQL', err);
  }
}

async function retakeIncorrectOnly() {
  const updated = { ...userAnswers.value };
  for (const q of allQuestions.value) {
    if (updated[q.id] !== undefined && updated[q.id] !== q.correctIndex) {
      delete updated[q.id];
    }
  }
  userAnswers.value = updated;

  try {
    await saveMutation.mutateAsync({
      answers: updated,
      score: quizScore.value,
      answeredCount: answeredCount.value
    });
  } catch (err) {
    console.error('Failed to update progress in PostgreSQL', err);
  }
}

async function resetQuiz() {
  userAnswers.value = {};
  currentPage.value = 1;

  try {
    await resetMutation.mutateAsync();
  } catch (err) {
    console.error('Failed to reset quiz in PostgreSQL', err);
  }
}
</script>

<template>
  <Card class="p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full min-w-0">
    <!-- Header & Score Dashboard -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
            🛠️ Project Engineering Mastery
          </span>
          <Badge variant="outline">{{ currentCategory }}</Badge>
          <span
            class="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase"
            :class="{
              'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20': currentDifficulty === 'BEGINNER',
              'bg-blue-500/10 text-blue-500 border border-blue-500/20': currentDifficulty === 'INTERMEDIATE',
              'bg-purple-500/10 text-purple-500 border border-purple-500/20': currentDifficulty === 'ADVANCED',
              'bg-amber-500/10 text-amber-500 border border-amber-500/20': currentDifficulty === 'EXPERT',
              'bg-accent text-foreground': currentDifficulty === 'ALL'
            }"
          >
            {{ currentDifficulty }}
          </span>
          <span class="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-bold flex items-center gap-1">
            🗄️ PostgreSQL Model: QuizProgress
          </span>
        </div>
        <h3 class="text-2xl font-black text-foreground">🟢 Vue 3.5 Project-Building Challenge</h3>
        <p class="text-xs text-muted-foreground">
          Practical application development scenarios with real-time PostgreSQL database persistence.
        </p>
      </div>

      <!-- Score & Accuracy Stats -->
      <div class="flex items-center gap-3 bg-accent/30 p-3.5 rounded-2xl border border-border shrink-0">
        <div class="text-right">
          <div class="text-xs font-bold text-foreground">
            Score: <span class="text-primary font-mono text-sm font-black">{{ quizScore }}</span> / {{ answeredCount }}
          </div>
          <div class="text-[10px] text-muted-foreground font-mono">
            Accuracy: <span class="font-bold text-emerald-500">{{ accuracyPercentage }}%</span>
          </div>
        </div>
        <div class="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-md">
          🏆
        </div>
      </div>
    </div>

    <!-- Mode Selector & Progress Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-accent/20 p-3 rounded-2xl border border-border">
      <div class="flex items-center gap-2 text-xs font-bold text-foreground flex-wrap">
        <span>Quiz Mode:</span>
        <button
          :class="quizMode === 'ALL' ? 'bg-primary text-primary-foreground font-bold' : 'bg-background hover:bg-accent text-muted-foreground'"
          class="px-2.5 py-1 rounded-lg border border-border text-xs transition-all"
          @click="setQuizMode('ALL')"
        >
          Full Bank (100 Qs)
        </button>
        <button
          :class="quizMode === 'SPRINT_20' ? 'bg-primary text-primary-foreground font-bold' : 'bg-background hover:bg-accent text-muted-foreground'"
          class="px-2.5 py-1 rounded-lg border border-border text-xs transition-all"
          @click="setQuizMode('SPRINT_20')"
        >
          ⚡ 20-Question Sprint
        </button>
      </div>

      <div class="text-xs font-mono text-muted-foreground text-right w-full sm:w-auto">
        Progress: <span class="font-bold text-foreground">{{ answeredCount }} / {{ displayQuestions.length }}</span> ({{ progressPercentage }}%)
      </div>
    </div>

    <!-- Animated Gradient Progress Bar -->
    <div class="h-2 w-full bg-accent rounded-full overflow-hidden border border-border">
      <div
        class="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-primary transition-all duration-300 rounded-full"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>

    <!-- Filter Controls: Categories & Difficulty -->
    <div class="space-y-3 pt-1">
      <!-- Domain Categories -->
      <div class="space-y-1">
        <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Engineering Domain:</span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="currentCategory === cat ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-accent/80 text-muted-foreground'"
            class="px-2.5 py-1 text-xs rounded-lg border border-border font-medium transition-all"
            @click="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Seniority Level -->
      <div class="space-y-1 pt-1">
        <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Seniority Level:</span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="diff in difficulties"
            :key="diff"
            :class="currentDifficulty === diff ? 'bg-foreground text-background font-bold' : 'hover:bg-accent/80 text-muted-foreground'"
            class="px-2.5 py-1 text-xs rounded-lg border border-border font-medium transition-all font-mono"
            @click="selectDifficulty(diff)"
          >
            {{ diff }}
          </button>
        </div>
      </div>

      <!-- Search Bar & Top Pagination -->
      <div class="flex flex-col sm:flex-row gap-2 items-center justify-between pt-2">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search scenarios, composables, code keywords..."
          class="w-full sm:w-80 px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          @input="currentPage = 1"
        />

        <div class="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto justify-end">
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <div class="flex gap-1">
            <button
              :disabled="currentPage <= 1"
              class="px-2.5 py-1 rounded bg-accent border border-border font-bold disabled:opacity-30 hover:bg-accent/80"
              @click="prevPage"
            >
              ‹ Prev
            </button>
            <button
              :disabled="currentPage >= totalPages"
              class="px-3 py-1.5 rounded bg-accent border border-border font-bold disabled:opacity-30 hover:bg-accent/80"
              @click="nextPage"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading && allQuestions.length === 0" class="space-y-4 py-8">
      <div v-for="i in 3" :key="i" class="p-6 rounded-2xl bg-accent/30 border border-border animate-pulse space-y-3">
        <div class="h-4 bg-muted rounded w-3/4"></div>
        <div class="space-y-2">
          <div class="h-8 bg-muted/60 rounded"></div>
          <div class="h-8 bg-muted/60 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Question List -->
    <div v-else class="space-y-6 pt-2">
      <div
        v-for="q in paginatedQuestions"
        :key="q.id"
        class="p-5 rounded-2xl bg-accent/20 border border-border space-y-4 shadow-sm w-full min-w-0"
      >
        <!-- Question Badge & Title -->
        <div class="space-y-2 w-full">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="h-5 px-1.5 rounded-md bg-primary/20 text-primary font-mono font-bold text-[11px] flex items-center justify-center">
              #{{ q.id }}
            </span>
            <span class="text-[10px] font-mono uppercase bg-accent px-2 py-0.5 rounded text-muted-foreground font-bold">
              {{ q.category }}
            </span>
            <span
              class="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
              :class="{
                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20': q.difficulty === 'BEGINNER',
                'bg-blue-500/10 text-blue-500 border border-blue-500/20': q.difficulty === 'INTERMEDIATE',
                'bg-purple-500/10 text-purple-500 border border-purple-500/20': q.difficulty === 'ADVANCED',
                'bg-amber-500/10 text-amber-500 border border-amber-500/20': q.difficulty === 'EXPERT'
              }"
            >
              {{ q.difficulty }}
            </span>
            <span v-if="userAnswers[q.id] !== undefined" class="text-[10px] font-mono font-bold text-muted-foreground ml-auto">
              Status: {{ userAnswers[q.id] === q.correctIndex ? '✅ Completed' : '❌ Needs Practice' }}
            </span>
          </div>

          <h4 class="text-sm sm:text-base font-bold text-foreground leading-snug">
            {{ q.question }}
          </h4>

          <!-- Code Snippet -->
          <div v-if="q.codeSnippet" class="p-3 bg-zinc-950 dark:bg-black/80 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-48 overflow-y-auto">
            <pre class="whitespace-pre font-mono">{{ q.codeSnippet }}</pre>
          </div>
        </div>

        <!-- Options Grid -->
        <div class="space-y-2 pt-1">
          <button
            v-for="(opt, idx) in q.options"
            :key="idx"
            :disabled="userAnswers[q.id] !== undefined"
            :class="{
              'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold': userAnswers[q.id] !== undefined && idx === q.correctIndex,
              'bg-rose-500/20 border-rose-500 text-rose-500 font-bold': userAnswers[q.id] === idx && idx !== q.correctIndex,
              'bg-background hover:bg-accent/60 text-foreground': userAnswers[q.id] === undefined
            }"
            class="w-full text-left p-3 rounded-xl text-xs font-medium border border-border transition-colors flex items-center justify-between gap-3"
            @click="answerQuestion(q.id, idx)"
          >
            <span class="flex-1 leading-relaxed">{{ opt }}</span>
            <span v-if="userAnswers[q.id] !== undefined && idx === q.correctIndex" class="font-bold text-emerald-500 shrink-0 text-xs">
              ✓ Correct
            </span>
            <span v-if="userAnswers[q.id] === idx && idx !== q.correctIndex" class="font-bold text-rose-500 shrink-0 text-xs">
              ✕ Incorrect
            </span>
          </button>
        </div>

        <!-- Technical Rationale & Single Retake -->
        <div v-if="userAnswers[q.id] !== undefined" class="p-4 bg-background/95 rounded-xl border border-border text-xs text-muted-foreground space-y-1.5 shadow-inner">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 text-foreground font-bold">
              <span>💡 Architectural Rationale:</span>
            </div>
            <button
              class="text-[10px] text-primary hover:underline font-bold"
              @click="retakeQuestion(q.id)"
            >
              🔄 Retake This Question
            </button>
          </div>
          <p class="leading-relaxed">{{ q.explanation }}</p>
        </div>
      </div>

      <div v-if="paginatedQuestions.length === 0" class="p-12 text-center text-muted-foreground text-xs bg-accent/10 rounded-2xl border border-dashed border-border">
        No questions match your current category and difficulty filter.
      </div>
    </div>

    <!-- Bottom Controls & Navigation -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-4">
      <div class="flex items-center gap-2 flex-wrap">
        <button
          class="px-3.5 py-2 text-xs font-bold bg-accent hover:bg-accent/80 border border-border rounded-xl transition-colors text-foreground"
          title="Clear all answers and restart"
          @click="resetQuiz"
        >
          🔄 Retake Entire Quiz
        </button>

        <button
          v-if="incorrectCount > 0"
          class="px-3.5 py-2 text-xs font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors"
          title="Reset only questions you got wrong to practice until 100%"
          @click="retakeIncorrectOnly"
        >
          🎯 Retake {{ incorrectCount }} Incorrect Only
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Showing page {{ currentPage }} of {{ totalPages }}</span>
        <div class="flex gap-1.5">
          <button
            :disabled="currentPage <= 1"
            class="px-3 py-1.5 rounded-lg bg-accent border border-border font-bold disabled:opacity-30 hover:bg-accent/80"
            @click="prevPage"
          >
            ‹ Prev
          </button>
          <button
            :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold disabled:opacity-30 hover:opacity-90 shadow-sm"
            @click="nextPage"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  </Card>
</template>
