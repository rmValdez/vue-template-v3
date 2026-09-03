<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ModelTab from '../components/ModelTab.vue';
import ReactivityTab from '../components/ReactivityTab.vue';
import ControlFlowTab from '../components/ControlFlowTab.vue';
import FormsTab from '../components/FormsTab.vue';
import AdvancedTab from '../components/AdvancedTab.vue';
import VueQuizTab from '../components/VueQuizTab.vue';
import VueArchitectureGuideTab from '../components/VueArchitectureGuideTab.vue';

const route = useRoute();

const TAB_MAP: Record<string, number> = {
  model: 1,
  '1': 1,
  db: 1,
  reactivity: 2,
  '2': 2,
  'control-flow': 3,
  '3': 3,
  templates: 3,
  forms: 4,
  '4': 4,
  advanced: 5,
  '5': 5,
  quiz: 6,
  '6': 6,
  architecture: 7,
  '7': 7,
  guide: 7
};

const activeTab = ref<number>(6);

watch(
  () => route.query.tab,
  newTab => {
    if (typeof newTab === 'string' && TAB_MAP[newTab]) {
      activeTab.value = TAB_MAP[newTab];
    } else {
      activeTab.value = 6;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-6 max-w-6xl mx-auto w-full min-w-0">
    <!-- Active Tab Screen Driven by Sidebar -->
    <main class="w-full min-w-0">
      <ModelTab v-if="activeTab === 1" />
      <ReactivityTab v-else-if="activeTab === 2" />
      <ControlFlowTab v-else-if="activeTab === 3" />
      <FormsTab v-else-if="activeTab === 4" />
      <AdvancedTab v-else-if="activeTab === 5" />
      <VueQuizTab v-else-if="activeTab === 6" />
      <VueArchitectureGuideTab v-else-if="activeTab === 7" />
    </main>
  </div>
</template>
