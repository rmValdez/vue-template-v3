<script setup lang="ts">
import { ref, type Component } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Layers,
  Sparkles,
  Database,
  Zap,
  GitBranch,
  CheckSquare,
  Trophy,
  BookOpen,
  ChevronDown
} from 'lucide-vue-next';
import ThemeToggle from './ThemeToggle.vue';

export interface NavUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface NavItemChild {
  name: string;
  path: string;
  tab: string;
  icon: Component;
  badge?: string;
}

export interface NavItem {
  name: string;
  path?: string;
  icon: Component;
  badge?: string;
  children?: NavItemChild[];
}

const props = defineProps<{
  user?: NavUser | null;
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
}>();

const route = useRoute();
const router = useRouter();
const isMobileSidebarOpen = ref(false);

const expandedGroups = ref<Record<string, boolean>>({
  'Vue 3.5 Sandbox': true
});

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Vue 3.5 Sandbox',
    path: '/sandbox',
    icon: Sparkles,
    badge: '7 Labs',
    children: [
      {
        name: 'Model & DB',
        path: '/sandbox?tab=model',
        tab: 'model',
        icon: Database
      },
      {
        name: 'Reactivity Lab',
        path: '/sandbox?tab=reactivity',
        tab: 'reactivity',
        icon: Zap
      },
      {
        name: 'Control Flow',
        path: '/sandbox?tab=control-flow',
        tab: 'control-flow',
        icon: GitBranch
      },
      {
        name: 'Forms & Zod',
        path: '/sandbox?tab=forms',
        tab: 'forms',
        icon: CheckSquare
      },
      {
        name: 'Advanced Tech',
        path: '/sandbox?tab=advanced',
        tab: 'advanced',
        icon: Layers
      },
      {
        name: 'Scenario Quiz',
        path: '/sandbox?tab=quiz',
        tab: 'quiz',
        icon: Trophy,
        badge: '100 Qs'
      },
      {
        name: 'Architecture Guide',
        path: '/sandbox?tab=architecture',
        tab: 'architecture',
        icon: BookOpen
      }
    ]
  },
  {
    name: 'Users',
    path: '/users',
    icon: Users
  }
];

function toggleGroup(name: string) {
  expandedGroups.value[name] = !expandedGroups.value[name];
}

function isGroupActive(item: NavItem): boolean {
  if (item.path && route.path.startsWith(item.path)) return true;
  if (item.children?.some(child => isChildActive(child.tab))) return true;
  return false;
}

function isChildActive(tabSlug: string): boolean {
  if (route.path !== '/sandbox') return false;
  const currentTab = (route.query.tab as string) || 'quiz';
  return (
    currentTab === tabSlug ||
    (tabSlug === 'model' && currentTab === '1') ||
    (tabSlug === 'reactivity' && currentTab === '2') ||
    (tabSlug === 'control-flow' && currentTab === '3') ||
    (tabSlug === 'forms' && currentTab === '4') ||
    (tabSlug === 'advanced' && currentTab === '5') ||
    (tabSlug === 'quiz' && currentTab === '6') ||
    (tabSlug === 'architecture' && currentTab === '7')
  );
}

function handleLogout() {
  emit('logout');
  router.push('/login');
}
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground flex flex-col md:flex-row"
  >
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-xl shrink-0 p-4 justify-between sticky top-0 h-screen overflow-y-auto"
    >
      <div class="space-y-6">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-2 py-1">
          <div
            class="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20"
          >
            <Layers class="h-5 w-5" />
          </div>
          <div>
            <h1
              class="font-extrabold text-sm tracking-tight leading-none text-foreground"
            >
              VUE MASTER
            </h1>
            <span
              class="text-[10px] font-semibold text-primary tracking-widest uppercase"
            >
              Template v3
            </span>
          </div>
        </div>

        <!-- Navigation Links (Modular Parent / Children) -->
        <nav class="space-y-1.5">
          <div
            v-for="item in navigationItems"
            :key="item.name"
            class="space-y-1"
          >
            <!-- Parent WITHOUT Children -->
            <RouterLink
              v-if="!item.children"
              :to="item.path!"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              :class="[
                route.path === item.path
                  ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              ]"
            >
              <div class="flex items-center gap-3 truncate">
                <component :is="item.icon" class="h-4 w-4 shrink-0" />
                <span class="truncate">{{ item.name }}</span>
              </div>
              <span
                v-if="item.badge"
                class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary"
              >
                {{ item.badge }}
              </span>
            </RouterLink>

            <!-- Parent WITH Children (Expandable Collapsible Accordion) -->
            <div v-else class="space-y-1">
              <button
                type="button"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group"
                :class="[
                  isGroupActive(item)
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
                @click="toggleGroup(item.name)"
              >
                <div class="flex items-center gap-3 truncate">
                  <component
                    :is="item.icon"
                    class="h-4 w-4 shrink-0 text-primary"
                  />
                  <span class="truncate">{{ item.name }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span
                    v-if="item.badge"
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-wide"
                  >
                    {{ item.badge }}
                  </span>
                  <ChevronDown
                    class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200"
                    :class="{ 'rotate-180': expandedGroups[item.name] }"
                  />
                </div>
              </button>

              <!-- Children Tree with Guide Line -->
              <div
                v-if="expandedGroups[item.name]"
                class="ml-3.5 pl-2.5 border-l-2 border-border/70 space-y-0.5 animate-in slide-in-from-top-1 duration-150"
              >
                <RouterLink
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  class="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                  :class="[
                    isChildActive(child.tab)
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate">
                    <component :is="child.icon" class="h-3.5 w-3.5 shrink-0" />
                    <span class="truncate">{{ child.name }}</span>
                  </div>
                  <span
                    v-if="child.badge"
                    class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                    :class="[
                      isChildActive(child.tab)
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    ]"
                  >
                    {{ child.badge }}
                  </span>
                </RouterLink>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- User Profile & Footer -->
      <div class="pt-4 border-t border-border space-y-3">
        <div class="flex items-center justify-between px-2">
          <span class="text-xs text-muted-foreground font-medium">Theme</span>
          <ThemeToggle />
        </div>

        <div
          v-if="props.user"
          class="flex items-center justify-between p-2 rounded-lg bg-accent/40"
        >
          <div class="flex items-center gap-2.5 overflow-hidden">
            <img
              v-if="props.user.avatar"
              :src="props.user.avatar"
              :alt="props.user.name"
              class="h-8 w-8 rounded-full border border-border shrink-0 object-cover"
            />
            <div
              v-else
              class="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0"
            >
              {{ props.user.name.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold truncate text-foreground">
                {{ props.user.name }}
              </p>
              <p
                class="text-[10px] text-muted-foreground truncate uppercase font-mono"
              >
                {{ props.user.role }}
              </p>
            </div>
          </div>
          <button
            type="button"
            title="Sign out"
            class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header
      class="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
        >
          <Layers class="h-4 w-4" />
        </div>
        <span class="font-bold text-sm tracking-tight text-foreground"
          >Vue Template</span
        >
      </div>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          class="p-2 text-foreground rounded-lg hover:bg-accent"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        >
          <X v-if="isMobileSidebarOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </header>

    <!-- Mobile Sidebar Drawer -->
    <div
      v-if="isMobileSidebarOpen"
      class="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      @click.self="isMobileSidebarOpen = false"
    >
      <div
        class="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card border-r border-border p-5 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Layers class="h-5 w-5 text-primary" />
              <span class="font-bold text-base">Vue Master</span>
            </div>
            <button
              type="button"
              class="p-1.5 text-muted-foreground hover:bg-accent rounded-md"
              @click="isMobileSidebarOpen = false"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <nav class="space-y-1.5">
            <div
              v-for="item in navigationItems"
              :key="item.name"
              class="space-y-1"
            >
              <!-- Mobile Parent WITHOUT Children -->
              <RouterLink
                v-if="!item.children"
                :to="item.path!"
                class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium"
                :class="[
                  route.path === item.path
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                ]"
                @click="isMobileSidebarOpen = false"
              >
                <div class="flex items-center gap-3 truncate">
                  <component :is="item.icon" class="h-4 w-4 shrink-0" />
                  <span class="truncate">{{ item.name }}</span>
                </div>
                <span
                  v-if="item.badge"
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary"
                >
                  {{ item.badge }}
                </span>
              </RouterLink>

              <!-- Mobile Parent WITH Children -->
              <div v-else class="space-y-1">
                <button
                  type="button"
                  class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium"
                  :class="[
                    isGroupActive(item)
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  ]"
                  @click="toggleGroup(item.name)"
                >
                  <div class="flex items-center gap-3 truncate">
                    <component
                      :is="item.icon"
                      class="h-4 w-4 shrink-0 text-primary"
                    />
                    <span class="truncate">{{ item.name }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span
                      v-if="item.badge"
                      class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary uppercase"
                    >
                      {{ item.badge }}
                    </span>
                    <ChevronDown
                      class="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200"
                      :class="{ 'rotate-180': expandedGroups[item.name] }"
                    />
                  </div>
                </button>

                <!-- Mobile Children -->
                <div
                  v-if="expandedGroups[item.name]"
                  class="ml-3.5 pl-2.5 border-l-2 border-border/70 space-y-0.5"
                >
                  <RouterLink
                    v-for="child in item.children"
                    :key="child.path"
                    :to="child.path"
                    class="flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium"
                    :class="[
                      isChildActive(child.tab)
                        ? 'bg-primary text-primary-foreground font-bold'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    ]"
                    @click="isMobileSidebarOpen = false"
                  >
                    <div class="flex items-center gap-2 truncate">
                      <component
                        :is="child.icon"
                        class="h-3.5 w-3.5 shrink-0"
                      />
                      <span class="truncate">{{ child.name }}</span>
                    </div>
                    <span
                      v-if="child.badge"
                      class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                      :class="[
                        isChildActive(child.tab)
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      ]"
                    >
                      {{ child.badge }}
                    </span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div v-if="props.user" class="pt-4 border-t border-border">
          <button
            type="button"
            class="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <div class="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        <slot />
      </div>
    </main>
  </div>
</template>
