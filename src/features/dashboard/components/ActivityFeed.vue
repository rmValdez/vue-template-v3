<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge
} from '@/shared/ui';
import type { ActivityList } from '../model/types';
import { Activity, ShieldCheck, UserCheck, AlertCircle } from 'lucide-vue-next';

defineProps<{
  activities?: ActivityList;
  loading?: boolean;
}>();

const iconMap = {
  success: ShieldCheck,
  info: UserCheck,
  warning: Activity,
  error: AlertCircle
};

const badgeMap = {
  success: 'success' as const,
  info: 'default' as const,
  warning: 'warning' as const,
  error: 'destructive' as const
};
</script>

<template>
  <Card className="col-span-full lg:col-span-1">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Audit &amp; Events</CardTitle>
        <Badge variant="outline" className="text-[10px]">Realtime</Badge>
      </div>
      <CardDescription>Security and administrative timeline</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="h-14 rounded-lg bg-muted/40 animate-pulse"
        ></div>
      </div>

      <div v-else-if="activities && activities.length > 0" class="space-y-4">
        <div
          v-for="item in activities"
          :key="item.id"
          class="flex items-start gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/60 transition-colors"
        >
          <div
            class="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            :class="[
              item.type === 'success' && 'bg-emerald-500/10 text-emerald-500',
              item.type === 'info' && 'bg-blue-500/10 text-blue-500',
              item.type === 'warning' && 'bg-amber-500/10 text-amber-500',
              item.type === 'error' && 'bg-rose-500/10 text-rose-500'
            ]"
          >
            <component :is="iconMap[item.type]" class="h-4 w-4" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-xs font-bold text-foreground truncate">
                {{ item.title }}
              </h4>
              <Badge
                :variant="badgeMap[item.type]"
                className="text-[9px] px-1.5 py-0"
              >
                {{ item.type }}
              </Badge>
            </div>
            <p class="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              {{ item.description }}
            </p>
            <span
              class="text-[10px] text-muted-foreground/60 font-mono mt-1 block"
            >
              {{ item.timestamp }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-xs text-muted-foreground">
        No recent activity found.
      </div>
    </CardContent>
  </Card>
</template>
