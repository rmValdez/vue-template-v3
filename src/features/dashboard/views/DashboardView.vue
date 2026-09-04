<script setup lang="ts">
import { useDashboardStats, useDashboardActivity } from '../api/dashboardApi';
import MetricCard from '../components/MetricCard.vue';
import OverviewChart from '../components/OverviewChart.vue';
import ActivityFeed from '../components/ActivityFeed.vue';
import { Users, Activity, DollarSign, ShieldCheck } from 'lucide-vue-next';

const { data: stats, isLoading: _isStatsLoading } = useDashboardStats();
const { data: activity, isLoading: isActivityLoading } = useDashboardActivity();
</script>

<template>
  <div class="space-y-6">
    <!-- Header banner -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl font-black tracking-tight text-foreground">
          Workspace Overview
        </h2>
        <p class="text-xs text-muted-foreground mt-0.5">
          Enterprise operational metrics, traffic analytics, and security
          telemetry
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
        >
          <span
            class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
          ></span>
          Cluster Healthy
        </span>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Active Users"
        :value="stats ? stats.totalUsers.toLocaleString() : '---'"
        :change="stats?.usersGrowth"
        :icon="Users"
      />
      <MetricCard
        title="Concurrent Sessions"
        :value="stats ? stats.activeSessions.toLocaleString() : '---'"
        :change="stats?.sessionsGrowth"
        :icon="Activity"
      />
      <MetricCard
        title="Annualized Run Rate"
        :value="stats ? `$${stats.totalRevenue.toLocaleString()}` : '---'"
        :change="stats?.revenueGrowth"
        :icon="DollarSign"
      />
      <MetricCard
        title="Service Uptime"
        :value="stats ? `${stats.apiHealth}%` : '---'"
        change-label="SLA Target 99.9%"
        :icon="ShieldCheck"
      />
    </div>

    <!-- Interactive Charts & Activity Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <OverviewChart />
      <ActivityFeed :activities="activity" :loading="isActivityLoading" />
    </div>
  </div>
</template>
