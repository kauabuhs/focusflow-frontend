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
  { day: 'MON', value: 50,  highlight: false },
  { day: 'TUE', value: 65,  highlight: false },
  { day: 'WED', value: 45,  highlight: false },
  { day: 'THU', value: 80,  highlight: false },
  { day: 'FRI', value: 90,  highlight: true  },
  { day: 'SAT', value: 55,  highlight: false },
  { day: 'SUN', value: 70,  highlight: false },
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
  return { 
    HIGH: 'priority--high', 
    MEDIUM: 'priority--medium', 
    LOW: 'priority--low' 
  }[p]
}

function badgeClass(v: StatCard['badgeVariant']): string {
  return { 
    default: 'badge--blue', 
    success: 'badge--green', 
    warning: 'badge--amber' 
  }[v]
}
</script>

<template>
  <div class="dashboard">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <header class="dashboard__header">
      <div>
        <h1 class="dashboard__greeting">{{ greeting }}, {{ userName }}.</h1>
        <p class="dashboard__sub">
          You have <strong>{{ highPriorityCount }} high priority tasks</strong> to complete today.
        </p>
      </div>
    </header>

    <!-- ── Stats ──────────────────────────────────────────────────────────── -->
    <section class="stats-grid">
      <Card v-for="stat in stats" :key="stat.id" class="stat-card">
        <div class="stat-card__body">
          <div class="stat-card__top">
            <div class="stat-card__icon-wrap">
              <component :is="stat.icon" :size="18" class="stat-card__icon" />
            </div>
            <span class="stat-badge" :class="badgeClass(stat.badgeVariant)">
              {{ stat.badge }}
            </span>
          </div>

          <p class="stat-card__label">{{ stat.label }}</p>

          <div class="stat-card__value-row">
            <span class="stat-card__value">{{ stat.value }}</span>
            <span class="stat-card__sub">/ {{ stat.sub }}</span>
          </div>

          <div class="stat-card__trend">
            <ArrowUpRight :size="12" class="stat-card__trend-icon" />
            <span>{{ stat.trend }}</span>
          </div>
        </div>
      </Card>
    </section>

    <!-- ── Bottom Grid ────────────────────────────────────────────────────── -->
    <div class="bottom-grid">

      <!-- Tasks Card -->
      <Card class="tasks-card">
        <div class="tasks-card__header">
          <h2 class="section-title">Today's Tasks</h2>
          <button class="view-all-btn">View all</button>
        </div>

        <div class="tasks-card__body">
          <ul class="task-list">
            <li
              v-for="task in tasks"
              :key="task.id"
              class="task-item"
              :class="{ 'task-item--done': task.done }"
            >
              <Checkbox
                :id="task.id"
                :checked="task.done"
                @update:checked="() => toggleTask(task.id)"
              />

              <div class="task-item__content">
                <label :for="task.id" class="task-item__title">{{ task.title }}</label>
                <span class="task-item__sub">{{ task.subtitle }}</span>
              </div>

              <div class="task-item__right">
                <span class="priority-pill" :class="priorityClass(task.priority)">
                  {{ task.priority }}
                </span>

                <div class="task-menu">
                  <button class="task-menu__trigger" @click="toggleMenu(task.id)">
                    <MoreHorizontal :size="15" />
                  </button>
                  <div v-if="openMenuId === task.id" class="task-menu__dropdown">
                    <button class="task-menu__item" @click="toggleTask(task.id)">
                      {{ task.done ? 'Mark as pending' : 'Mark as done' }}
                    </button>
                    <button class="task-menu__item task-menu__item--danger" @click="removeTask(task.id)">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div class="add-task">
            <button class="add-task__btn" @click="addTask">
              <Plus :size="14" />
              <span>Add a new task</span>
            </button>
          </div>
        </div>
      </Card>

      <!-- Right Column -->
      <div class="right-col">

        <!-- Focus Card -->
        <Card class="focus-card">
          <div class="focus-card__body">
            <p class="focus-card__eyebrow">RECOMMENDED SESSION</p>
            <h2 class="focus-card__title">Deep Work Protocol</h2>
            <p class="focus-card__desc">
              Minimize distractions and maximize your output for 90 minutes.
            </p>

            <div class="focus-card__meta">
              <div class="focus-meta-item">
                <span class="focus-meta-item__label">DURATION</span>
                <span class="focus-meta-item__value">90 min</span>
              </div>
              <div class="focus-meta-divider" />
              <div class="focus-meta-item">
                <span class="focus-meta-item__label">MODE</span>
                <span class="focus-meta-item__value">Zen Flow</span>
              </div>
            </div>

            <Button class="focus-card__cta">
              <Play :size="15" />
              Start Timer
            </Button>
          </div>
        </Card>

        <!-- Performance Card -->
        <Card class="perf-card">
          <div class="perf-card__header">
            <h3 class="section-title">Recent Performance</h3>
            <TrendingUp :size="16" class="perf-card__icon" />
          </div>

          <div class="perf-card__body">
            <div class="bar-chart">
              <div v-for="bar in performance" :key="bar.day" class="bar-col">
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :class="{ 'bar-fill--active': bar.highlight }"
                    :style="{ height: bar.value + '%' }"
                  />
                </div>
                <span class="bar-label">{{ bar.day }}</span>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Shell ──────────────────────────────────────────────────────────────── */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeUp 0.35s ease both;
}

@keyframes fadeUp {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0);    
  }
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.dashboard__header { 
  display: flex; 
  align-items: flex-end; 
  justify-content: space-between; 
}

.dashboard__greeting {
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.dashboard__sub { 
  font-size: 0.85rem; 
  color: #6b7280; 
  margin-top: 4px; 
}
.dashboard__sub strong { 
  color: #111827; 
  font-weight: 600; 
}

/* ── Stats ──────────────────────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card { 
  border: 1px solid #e5e7eb; 
  border-radius: 14px; 
  transition: box-shadow 0.2s; 
}
.stat-card:hover { 
  box-shadow: 0 4px 20px rgba(0,0,0,0.07); 
}

.stat-card__body { 
  padding: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}

.stat-card__top { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  margin-bottom: 4px; 
}

.stat-card__icon-wrap {
  width: 34px; 
  height: 34px;
  border-radius: 9px; 
  background: #eff6ff;
  display: flex; 
  align-items: center; 
  justify-content: center;
}
.stat-card__icon { 
  color: #2563eb; 
}

.stat-badge {
  font-size: 0.62rem; 
  font-weight: 700; 
  letter-spacing: 0.05em;
  padding: 3px 8px; 
  border-radius: 999px;
}
.badge--blue   { background: #eff6ff; color: #2563eb; }
.badge--green  { background: #dcfce7; color: #16a34a; }
.badge--amber  { background: #fef3c7; color: #d97706; }

.stat-card__label {
  font-size: 0.7rem; 
  font-weight: 700; 
  text-transform: uppercase;
  letter-spacing: 0.07em; 
  color: #6b7280;
}

.stat-card__value-row { 
  display: flex; 
  align-items: baseline; 
  gap: 4px; 
}

.stat-card__value { 
  font-size: 2rem; 
  font-weight: 800; 
  color: #111827; 
  letter-spacing: -0.04em; 
  line-height: 1; 
}

.stat-card__sub { 
  font-size: 0.78rem; 
  color: #6b7280; 
}

.stat-card__trend { 
  display: flex; 
  align-items: center; 
  gap: 3px; 
  font-size: 0.72rem; 
  color: #16a34a; 
  font-weight: 500; 
}

.stat-card__trend-icon { 
  color: #16a34a; 
}

/* ── Bottom Grid ────────────────────────────────────────────────────────── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;
}

/* ── Tasks Card ─────────────────────────────────────────────────────────── */
.tasks-card { 
  border: 1px solid #e5e7eb; 
  border-radius: 14px; 
}

.tasks-card__header {
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  padding: 20px 20px 0;
}

.section-title { 
  font-size: 0.95rem; 
  font-weight: 700; 
  color: #111827; 
}

.view-all-btn {
  font-size: 0.8rem; 
  color: #2563eb; 
  font-weight: 600;
  background: transparent; 
  border: none; 
  cursor: pointer; 
  padding: 4px 8px;
  border-radius: 6px; 
  transition: opacity 0.15s;
}
.view-all-btn:hover { opacity: 0.7; }

.tasks-card__body { padding: 12px 20px 20px; }

.task-list { 
  list-style: none; 
  margin: 0; 
  padding: 0; 
  display: flex; 
  flex-direction: column; 
}

.task-item {
  display: flex; 
  align-items: center; 
  gap: 12px;
  padding: 11px 0; 
  border-bottom: 1px solid #e5e7eb;
}
.task-item:last-child { border-bottom: none; }
.task-item--done .task-item__title { 
  text-decoration: line-through; 
  color: #6b7280; 
}

.task-item__content { 
  flex: 1; 
  min-width: 0; 
  display: flex; 
  flex-direction: column; 
  gap: 1px; 
}

.task-item__title {
  font-size: 0.875rem; 
  font-weight: 500; 
  color: #111827;
  cursor: pointer; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
  transition: color 0.15s;
}
.task-item__title:hover { color: #2563eb; }

.task-item__sub { 
  font-size: 0.72rem; 
  color: #6b7280; 
}

.task-item__right { 
  display: flex; 
  align-items: center; 
  gap: 8px; flex-shrink: 0; 
}

.priority-pill { 
  font-size: 0.6rem; 
  font-weight: 700; 
  letter-spacing: 0.06em; 
  padding: 3px 8px; 
  border-radius: 999px; 
}

.priority--high   { background: #fee2e2; color: #dc2626; }
.priority--medium { background: #fef3c7; color: #d97706; }
.priority--low    { background: #dcfce7; color: #16a34a; }

/* Task menu */
.task-menu { position: relative; }

.task-menu__trigger {
  border: none; background: transparent; cursor: pointer; color: #6b7280;
  display: flex; align-items: center; padding: 2px;
  border-radius: 4px; transition: color 0.15s, background 0.15s;
}
.task-menu__trigger:hover { color: #111827; background: #f9fafb; }

.task-menu__dropdown {
  position: absolute; 
  top: calc(100% + 4px); 
  right: 0;
  background: #fff; 
  border: 1px solid #e5e7eb; 
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1); 
  z-index: 20; 
  min-width: 160px; 
  overflow: hidden;
}

.task-menu__item {
  display: flex; 
  width: 100%; 
  padding: 9px 14px; 
  text-align: left;
  border: none; 
  background: transparent; 
  cursor: pointer;
  font-size: 0.82rem; 
  color: #111827; 
  transition: background 0.1s;
}
.task-menu__item:hover { background: #f9fafb; }
.task-menu__item--danger { color: #dc2626; }
.task-menu__item--danger:hover { background: #fee2e2; }

.add-task { padding-top: 12px; }

.add-task__btn {
  display: flex; 
  align-items: center; 
  gap: 6px; 
  border: none;
  background: transparent; 
  color: #6b7280; 
  font-size: 0.82rem;
  cursor: pointer; 
  padding: 4px 0; 
  transition: color 0.15s;
}
.add-task__btn:hover { color: #2563eb; }

/* ── Right Column ───────────────────────────────────────────────────────── */
.right-col { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}

/* ── Focus Card ─────────────────────────────────────────────────────────── */
.focus-card { 
  background: #1d4ed8; 
  border: none; 
  border-radius: 16px; 
}

.focus-card__body { 
  padding: 24px; 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

.focus-card__eyebrow { 
  font-size: 0.62rem; 
  font-weight: 700; 
  letter-spacing: 0.1em; 
  color: #93c5fd; 
}

.focus-card__title   { 
  font-size: 1.5rem; 
  font-weight: 800; 
  color: #fff; 
  letter-spacing: -0.03em; 
  line-height: 1.15; 
}

.focus-card__desc { 
  font-size: 0.8rem; 
  color: #bfdbfe; 
  line-height: 1.5; 
}

.focus-card__meta { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
  margin-top: 4px; 
}

.focus-meta-item  { 
  display: flex; 
  flex-direction: column; 
  gap: 2px; 
}

.focus-meta-item__label { 
  font-size: 0.6rem; 
  font-weight: 700; 
  letter-spacing: 0.08em; 
  color: #93c5fd; 
}

.focus-meta-item__value { 
  font-size: 1.05rem; 
  font-weight: 700; 
  color: #fff; 
}
.focus-meta-divider { 
  width: 1px; 
  height: 32px; 
  background: #3b82f6; 
}

.focus-card__cta {
  margin-top: 4px; 
  width: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px;
  background: rgba(255,255,255,0.15); 
  color: #fff; 
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 10px; 
  font-weight: 600; 
  font-size: 0.875rem; 
  padding: 11px 0;
  cursor: pointer; 
  transition: background 0.2s;
}
.focus-card__cta:hover { background: rgba(255,255,255,0.25); }

/* ── Perf Card ──────────────────────────────────────────────────────────── */
.perf-card { 
  border: 1px solid #e5e7eb; 
  border-radius: 14px; 
}

.perf-card__header {
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  padding: 16px 20px 0;
}
.perf-card__icon { color: #2563eb; }
.perf-card__body { padding: 14px 20px 20px; }

.bar-chart { 
  display: flex; 
  align-items: flex-end; 
  gap: 8px; 
  height: 100px; 
}

.bar-col { 
  display: flex;
  flex-direction: column; 
  align-items: center; 
  gap: 6px; flex: 1; 
}

.bar-track {
  width: 100%; 
  height: 80px; 
  background: #f3f4f6;
  border-radius: 6px; 
  display: flex; 
  align-items: flex-end; 
  overflow: hidden;
}

.bar-fill {
  width: 100%; 
  background: #bfdbfe; 
  border-radius: 6px;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bar-fill--active { background: #2563eb; }

.bar-label { 
  font-size: 0.6rem; 
  font-weight: 600; 
  letter-spacing: 0.04em; 
  color: #6b7280; 
}

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 720px) {
  .stats-grid { grid-template-columns: 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
}
</style>
