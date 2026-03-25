<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Timer,
  CheckSquare,
  Zap,
  Plus,
  Play,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-vue-next'
import Button from '@/components/Button/Button.vue'
import Checkbox from '@/components/Checkbox/Checkbox.vue'
import Card from '@/components/Card/Card.vue'
import styles from './Dashboard.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

interface StatCard {
  id: string
  icon: ReturnType<typeof Timer>
  label: string
  value: string
  sub: string
  badge: string
  badgeVariant: 'default' | 'success' | 'warning'
  trend: string
  trendUp: boolean
}

interface Task {
  id: string
  title: string
  subtitle: string
  priority: Priority
  done: boolean
}

interface PerformanceBar {
  day: string
  value: number
  highlight: boolean
}

// ─── State ────────────────────────────────────────────────────────────────────

const greeting = computed<string>(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

const userName = ref('Alex')
const highPriorityCount = ref(5)
const openMenuId = ref<string | null>(null)

const stats = ref<StatCard[]>([
  {
    id: 'focus-time',
    icon: Timer,
    label: 'Focus Time',
    value: '4.5h',
    sub: 'on goal',
    badge: '+19%',
    badgeVariant: 'success',
    trend: 'vs last week',
    trendUp: true,
  },
  {
    id: 'tasks-completed',
    icon: CheckSquare,
    label: 'Tasks Completed',
    value: '12',
    sub: 'this week',
    badge: 'ON TRACK',
    badgeVariant: 'default',
    trend: 'on schedule',
    trendUp: true,
  },
  {
    id: 'productivity',
    icon: Zap,
    label: 'Productivity Score',
    value: '85%',
    sub: 'peak flow',
    badge: 'TOP 10%',
    badgeVariant: 'warning',
    trend: 'above average',
    trendUp: true,
  },
])

const tasks = ref<Task[]>([
  {
    id: '1',
    title: 'Finalize Q3 design system documentation',
    subtitle: 'Design System · 2h remaining',
    priority: 'HIGH',
    done: false,
  },
  {
    id: '2',
    title: 'Review engineering handoff files',
    subtitle: 'Engineering · Consolidation',
    priority: 'MEDIUM',
    done: true,
  },
  {
    id: '3',
    title: 'Sync with stakeholders for feedback',
    subtitle: 'Strategic · 4:00 PM',
    priority: 'MEDIUM',
    done: false,
  },
  {
    id: '4',
    title: 'Audit accessibility on mobile views',
    subtitle: 'QA · 5h remaining',
    priority: 'LOW',
    done: false,
  },
])

const performance = ref<PerformanceBar[]>([
  { day: 'MON', value: 50, highlight: false },
  { day: 'TUE', value: 65, highlight: false },
  { day: 'WED', value: 45, highlight: false },
  { day: 'THU', value: 80, highlight: false },
  { day: 'FRI', value: 90, highlight: true },
  { day: 'SAT', value: 55, highlight: false },
  { day: 'SUN', value: 70, highlight: false },
])

const newTaskTitle = ref('')

// ─── Methods ──────────────────────────────────────────────────────────────────

function toggleTask(id: string): void {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
  openMenuId.value = null
}

function addTask(): void {
  const title = newTaskTitle.value.trim()
  if (!title) return
  tasks.value.push({
    id: Date.now().toString(),
    title,
    subtitle: 'New task',
    priority: 'MEDIUM',
    done: false,
  })
  newTaskTitle.value = ''
}

function removeTask(id: string): void {
  tasks.value = tasks.value.filter(t => t.id !== id)
  openMenuId.value = null
}

function toggleMenu(id: string): void {
  openMenuId.value = openMenuId.value === id ? null : id
}

function priorityClass(p: Priority): string {
  return styles[`priority--${p.toLowerCase()}`] || ''
}

function badgeClass(v: StatCard['badgeVariant']): string {
  const map = {
    default: 'stat-badge--blue',
    success: 'stat-badge--green',
    warning: 'stat-badge--amber',
  }
  return styles[map[v]] || ''
}
</script>

<template>
  <div :class="styles.dashboard">
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <header :class="styles['dashboard__header']">
      <div>
        <h1 :class="styles['dashboard__greeting']">{{ greeting }}, {{ userName }}.</h1>
        <p :class="styles['dashboard__sub']">
          You have <strong>{{ highPriorityCount }} high priority tasks</strong> to complete today.
        </p>
      </div>
    </header>

    <!-- ── Stat Cards ──────────────────────────────────────────────────────── -->
    <section :class="styles['stats-grid']">
      <Card v-for="stat in stats" :key="stat.id" :class="styles['stat-card']">
        <div :class="styles['stat-card__body']">
          <div :class="styles['stat-card__top']">
            <div :class="styles['stat-card__icon-wrap']">
              <component :is="stat.icon" :size="18" :class="styles['stat-card__icon']" />
            </div>
            <span :class="[styles['stat-badge'], badgeClass(stat.badgeVariant)]">
              {{ stat.badge }}
            </span>
          </div>

          <p :class="styles['stat-card__label']">{{ stat.label }}</p>

          <div :class="styles['stat-card__value-row']">
            <span :class="styles['stat-card__value']">{{ stat.value }}</span>
            <span :class="styles['stat-card__sub']">/ {{ stat.sub }}</span>
          </div>

          <div :class="styles['stat-card__trend']">
            <ArrowUpRight :size="12" :class="styles['stat-card__trend-icon']" />
            <span>{{ stat.trend }}</span>
          </div>
        </div>
      </Card>
    </section>

    <!-- ── Bottom Grid ─────────────────────────────────────────────────────── -->
    <div :class="styles['bottom-grid']">
      <!-- Tasks Card -->
      <Card :class="styles['tasks-card']">
        <div :class="styles['tasks-card__header']">
          <h2 :class="styles['section-title']">Today's Tasks</h2>
          <Button class="ghost sm">View all</Button>
        </div>

        <div :class="styles['tasks-card__body']">
          <ul :class="styles['task-list']">
            <li
              v-for="task in tasks"
              :key="task.id"
              :class="[styles['task-item'], task.done && styles['task-item--done']]"
            >
              <Checkbox
                :id="task.id"
                :checked="task.done"
                :class="styles['task-item__check']"
                @update:checked="() => toggleTask(task.id)"
              />

              <div :class="styles['task-item__content']">
                <label :for="task.id" :class="styles['task-item__title']">
                  {{ task.title }}
                </label>
                <span :class="styles['task-item__sub']">{{ task.subtitle }}</span>
              </div>

              <div :class="styles['task-item__right']">
                <span :class="[styles['priority-pill'], priorityClass(task.priority)]">
                  {{ task.priority }}
                </span>

                <div class="task-menu">
                  <button
                    :class="styles['task-item__menu-btn']"
                    @click="toggleMenu(task.id)"
                  >
                    <MoreHorizontal :size="15" />
                  </button>

                  <div v-if="openMenuId === task.id" class="task-menu__dropdown">
                    <button
                      class="task-menu__item"
                      @click="toggleTask(task.id)"
                    >
                      {{ task.done ? 'Mark as pending' : 'Mark as done' }}
                    </button>
                    <button
                      class="task-menu__item task-menu__item--danger"
                      @click="removeTask(task.id)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div :class="styles['add-task']">
            <button :class="styles['add-task__btn']" @click="addTask">
              <Plus :size="14" />
              <span>Add a new task</span>
            </button>
          </div>
        </div>
      </Card>

      <!-- Right Column -->
      <div :class="styles['right-col']">
        <!-- Focus Card -->
        <Card :class="styles['focus-card']">
          <div :class="styles['focus-card__body']">
            <p :class="styles['focus-card__eyebrow']">RECOMMENDED SESSION</p>
            <h2 :class="styles['focus-card__title']">Deep Work Protocol</h2>
            <p :class="styles['focus-card__desc']">
              Minimize distractions and maximize your output for 90 minutes.
            </p>

            <div :class="styles['focus-card__meta']">
              <div :class="styles['focus-meta-item']">
                <span :class="styles['focus-meta-item__label']">DURATION</span>
                <span :class="styles['focus-meta-item__value']">90 min</span>
              </div>
              <div :class="styles['focus-meta-divider']" />
              <div :class="styles['focus-meta-item']">
                <span :class="styles['focus-meta-item__label']">MODE</span>
                <span :class="styles['focus-meta-item__value']">Zen Flow</span>
              </div>
            </div>

            <Button class="primary fullwidth">
              <Play :size="15" />
              Start Timer
            </Button>
          </div>
        </Card>

        <!-- Performance Card -->
        <Card :class="styles['perf-card']">
          <div :class="styles['perf-card__header']">
            <h3 :class="styles['section-title']">Recent Performance</h3>
            <TrendingUp :size="16" :class="styles['perf-card__trend-icon']" />
          </div>

          <div :class="styles['perf-card__body']">
            <div :class="styles['bar-chart']">
              <div
                v-for="bar in performance"
                :key="bar.day"
                :class="styles['bar-chart__col']"
              >
                <div :class="styles['bar-chart__track']">
                  <div
                    :class="[
                      styles['bar-chart__fill'],
                      bar.highlight && styles['bar-chart__fill--active']
                    ]"
                    :style="{ height: bar.value + '%' }"
                  />
                </div>
                <span :class="styles['bar-chart__label']">{{ bar.day }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Dropdown Menu */
.task-menu {
  position: relative;
}

.task-menu__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 180px;
}

.task-menu__item {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: #111827;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f9fafb;
  }

  &--danger {
    color: #dc2626;

    &:hover {
      background-color: #fee2e2;
    }
  }
}
</style>
