<script setup lang="ts">
import { ref } from 'vue';
import Card from '@/shared/ui/Card.vue';
import Badge from '@/shared/ui/Badge.vue';
import Button from '@/shared/ui/Button.vue';

const activeTab = ref<'ADMIN' | 'MANAGER' | 'GUEST'>('ADMIN');

const items = ref([
  { id: 101, title: 'Server Health Inspection', status: 'ACTIVE', priority: 'HIGH' },
  { id: 102, title: 'Prisma DB Migration', status: 'ACTIVE', priority: 'CRITICAL' },
  { id: 103, title: 'TanStack Query Sync', status: 'PENDING', priority: 'MEDIUM' },
  { id: 104, title: 'RBAC Policy Audit', status: 'PENDING', priority: 'LOW' }
]);

function addItem() {
  const newId = Date.now() % 10000;
  items.value.unshift({
    id: newId,
    title: `Scheduled Task #${newId}`,
    status: Math.random() > 0.5 ? 'ACTIVE' : 'PENDING',
    priority: 'MEDIUM'
  });
}

function removeItem(id: number) {
  items.value = items.value.filter((item) => item.id !== id);
}
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto w-full">
    <!-- Header -->
    <Card class="p-6 md:p-8 space-y-4 bg-gradient-to-br from-purple-500/10 via-primary/5 to-background border-purple-500/30">
      <div class="flex items-center gap-2">
        <Badge variant="outline" class="bg-purple-500/10 text-purple-500 border-purple-500/30 font-bold">
          🚥 Template Directives & Control Flow
        </Badge>
        <span class="text-xs font-mono text-muted-foreground">v-if, v-for, :key Reconciliation</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-foreground">
        Template Syntax & Control Flow Lab
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        Test conditional branch rendering (<code class="text-primary font-mono font-bold">v-if / v-else-if / v-else</code>), dynamic list rendering with stable <code class="text-primary font-mono font-bold">:key</code> reconciliation, and invisible <code class="text-primary font-mono font-bold">&lt;template&gt;</code> wrapper tags.
      </p>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- v-if / v-else Branching -->
      <Card class="p-5 md:p-6 space-y-4">
        <h3 class="text-base font-bold text-foreground">1. Conditional Branching (<code class="font-mono text-primary">v-if</code>)</h3>
        
        <!-- Role Buttons -->
        <div class="flex gap-2">
          <Button
            size="sm"
            :variant="activeTab === 'ADMIN' ? 'primary' : 'outline'"
            @click="activeTab = 'ADMIN'"
          >
            Admin View
          </Button>
          <Button
            size="sm"
            :variant="activeTab === 'MANAGER' ? 'primary' : 'outline'"
            @click="activeTab = 'MANAGER'"
          >
            Manager View
          </Button>
          <Button
            size="sm"
            :variant="activeTab === 'GUEST' ? 'primary' : 'outline'"
            @click="activeTab = 'GUEST'"
          >
            Guest View
          </Button>
        </div>

        <!-- Dynamic Output -->
        <div class="p-4 rounded-xl border border-border bg-accent/20 min-h-28 flex flex-col justify-center">
          <div v-if="activeTab === 'ADMIN'" class="space-y-1">
            <span class="text-xs font-bold text-emerald-500">🛡️ Administrator Clearance</span>
            <p class="text-xs text-muted-foreground">Full CRUD permissions, database migration access, and tenant administration enabled.</p>
          </div>
          <div v-else-if="activeTab === 'MANAGER'" class="space-y-1">
            <span class="text-xs font-bold text-blue-500">👔 Manager Clearance</span>
            <p class="text-xs text-muted-foreground">Department moderation, analytics overview, and task management enabled.</p>
          </div>
          <div v-else class="space-y-1">
            <span class="text-xs font-bold text-amber-500">👤 Guest Clearance</span>
            <p class="text-xs text-muted-foreground">Read-only preview mode. Please sign in to modify records.</p>
          </div>
        </div>
      </Card>

      <!-- v-for List Rendering with Key -->
      <Card class="p-5 md:p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-foreground">2. List Diffing (<code class="font-mono text-primary">v-for :key</code>)</h3>
          <Button size="sm" variant="primary" @click="addItem">+ Add Row</Button>
        </div>

        <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
          <div
            v-for="item in items"
            :key="item.id"
            class="p-2.5 rounded-xl border border-border bg-accent/30 flex items-center justify-between text-xs transition-all hover:bg-accent/60"
          >
            <div class="space-y-0.5">
              <div class="font-bold text-foreground">{{ item.title }}</div>
              <div class="text-[10px] font-mono text-muted-foreground">
                ID: #{{ item.id }} • Status: {{ item.status }}
              </div>
            </div>
            <Button size="sm" variant="ghost" class="text-rose-500 text-xs px-2 h-7" @click="removeItem(item.id)">
              ✕
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
