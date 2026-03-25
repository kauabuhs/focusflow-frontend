<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Timer,
  BarChart2,
  Settings,
  Bell,
  HelpCircle,
  Play,
  Search,
  LogOut,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  icon: ReturnType<typeof LayoutDashboard>
  to: string
}

interface User {
  name: string
  plan: string
  avatarUrl?: string
  initials: string
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { label: 'Dashboard',   icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Tasks',       icon: CheckSquare,     to: '/tasks'     },
  { label: 'Projects',    icon: FolderOpen,      to: '/projects'  },
  { label: 'Focus Timer', icon: Timer,           to: '/timer'     },
  { label: 'Analytics',   icon: BarChart2,       to: '/analytics' },
  { label: 'Settings',    icon: Settings,        to: '/settings'  },
]

// ─── State ────────────────────────────────────────────────────────────────────

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const notificationCount = ref(3)
const currentUser = ref<User>({
  name: 'Alex Rivera',
  plan: 'Pro Account',
  initials: 'AR',
  avatarUrl: undefined,
})

// ─── Computed ─────────────────────────────────────────────────────────────────

const isActive = (to: string): boolean => route.path === to
const hasNotifications = computed(() => notificationCount.value > 0)

// ─── Methods ──────────────────────────────────────────────────────────────────

function navigate(to: string): void {
  router.push(to)
}

function startFocusSession(): void {
  router.push('/timer')
}

function handleSearch(e: KeyboardEvent): void {
  if (e.key === 'Enter' && searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

function logout(): void {
  console.log('Logout')
}
</script>

<template>
  <TooltipProvider>
    <div class="flex h-screen bg-slate-50 dark:bg-slate-950">
      <!-- ═══════════════════════════════════════ SIDEBAR ═══════════════════════════════════════ -->
      <aside class="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
        
        <!-- Brand -->
        <div class="px-6 py-8 border-b border-slate-200 dark:border-slate-800">
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">FocusFlow</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Productivity Platform</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Tooltip v-for="item in navItems" :key="item.to">
            <TooltipTrigger as-child>
              <button
                @click="navigate(item.to)"
                :class="[
                  'w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 text-sm font-medium',
                  isActive(item.to)
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                ]"
              >
                <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span class="flex-1 text-left">{{ item.label }}</span>
                <div v-if="isActive(item.to)" class="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" class="hidden md:block">
              {{ item.label }}
            </TooltipContent>
          </Tooltip>
        </nav>

        <!-- Footer -->
        <div class="px-4 py-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
          <!-- Focus Session Button -->
          <Button
            @click="startFocusSession"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Play class="w-4 h-4 mr-2" />
            Focus Session
          </Button>

          <!-- User Profile -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="w-full p-3 rounded-lg flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
                <Avatar class="w-9 h-9">
                  <AvatarImage v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" :alt="currentUser.name" />
                  <AvatarFallback class="text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    {{ currentUser.initials }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1 text-left min-w-0">
                  <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ currentUser.name }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ currentUser.plan }}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" class="w-52">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="navigate('/settings')">
                <Settings class="w-4 h-4 mr-2" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="logout" class="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950">
                <LogOut class="w-4 h-4 mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <!-- ═══════════════════════════════════════ MAIN ═══════════════════════════════════════ -->
      <div class="flex-1 flex flex-col overflow-hidden">
        
        <!-- Top Bar -->
        <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 gap-4 shadow-sm">
          
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                v-model="searchQuery"
                placeholder="Buscar tarefas..."
                @keydown="handleSearch"
                class="pl-10 h-10 bg-slate-100 dark:bg-slate-800 border-0 text-sm placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="icon" @click="navigate('/notifications')" class="h-10 w-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div class="relative">
                    <Bell class="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <Badge v-if="hasNotifications" class="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
                      {{ notificationCount }}
                    </Badge>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notificações</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="icon" @click="navigate('/help')" class="h-10 w-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <HelpCircle class="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ajuda</TooltipContent>
            </Tooltip>

            <div class="w-px h-6 bg-slate-200 dark:bg-slate-700" />

            <!-- User Avatar (topbar) -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button class="h-10 w-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Avatar class="h-10 w-10">
                    <AvatarImage v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" :alt="currentUser.name" />
                    <AvatarFallback class="text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {{ currentUser.initials }}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-52">
                <DropdownMenuLabel>{{ currentUser.name }}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="navigate('/settings')">
                  <Settings class="w-4 h-4 mr-2" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout" class="text-red-600 dark:text-red-400">
                  <LogOut class="w-4 h-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <!-- Content Area -->
        <main class="flex-1 overflow-y-auto">
          <div class="p-8">
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </TooltipProvider>
</template>
