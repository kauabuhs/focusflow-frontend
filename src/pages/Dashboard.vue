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
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  value: number // 0-100
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

const stats = ref<StatCard[]>([
  {
    id: 'focus-time',
    icon: Timer,
    label: 'Focus Time',
    value: '4.5h',
    sub: 'En goal',
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
    sub: 'Peak flow',
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
}

function priorityClass(p: Priority): string {
  return {
    HIGH:   'priority--high',
    MEDIUM: 'priority--medium',
    LOW:    'priority--low',
  }[p]
}

function badgeClass(v: StatCard['badgeVariant']): string {
  return {
    default: 'stat-badge--blue',
    success: 'stat-badge--green',
    warning: 'stat-badge--amber',
  }[v]
}
</script>

<template>
  <div class="dashboard">

    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <header class="dashboard__header">
      <div>
        <h1 class="dashboard__greeting">{{ greeting }}, {{ userName }}.</h1>
        <p class="dashboard__sub">
          You have
          <strong>{{ highPriorityCount }} high priority tasks</strong>
          to complete today.
        </p>
      </div>
    </header>

    <!-- ── Stat Cards ──────────────────────────────────────────────────────── -->
    <section class="stats-grid">
      <Card
        v-for="stat in stats"
        :key="stat.id"
        class="stat-card"
      >
        <CardContent class="stat-card__body">
          <!-- Top row -->
          <div class="stat-card__top">
            <div class="stat-card__icon-wrap">
              <component :is="stat.icon" :size="18" class="stat-card__icon" />
            </div>
            <span class="stat-badge" :class="badgeClass(stat.badgeVariant)">
              {{ stat.badge }}
            </span>
          </div>

          <!-- Label -->
          <p class="stat-card__label">{{ stat.label }}</p>

          <!-- Value -->
          <div class="stat-card__value-row">
            <span class="stat-card__value">{{ stat.value }}</span>
            <span class="stat-card__sub">/ {{ stat.sub }}</span>
          </div>

          <!-- Trend -->
          <div class="stat-card__trend">
            <ArrowUpRight :size="12" class="stat-card__trend-icon" />
            <span>{{ stat.trend }}</span>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- ── Bottom Grid ─────────────────────────────────────────────────────── -->
    <div class="bottom-grid">

      <!-- Tasks ──────────────────────────────────────────── -->
      <Card class="tasks-card">
        <CardHeader class="tasks-card__header">
          <CardTitle class="section-title">Today's Tasks</CardTitle>
          <Button variant="ghost" size="sm" class="view-all-btn">View all</Button>
        </CardHeader>

        <CardContent class="tasks-card__body">
          <ul class="task-list">
            <li
              v-for="task in tasks"
              :key="task.id"
              class="task-item"
              :class="{ 'task-item--done': task.done }"
            >
              <!-- Checkbox -->
              <Checkbox
                :id="task.id"
                :checked="task.done"
                class="task-item__check"
                @update:checked="() => toggleTask(task.id)"
              />

              <!-- Text -->
              <div class="task-item__content">
                <label :for="task.id" class="task-item__title">
                  {{ task.title }}
                </label>
                <span class="task-item__sub">{{ task.subtitle }}</span>
              </div>

              <!-- Priority + Menu -->
              <div class="task-item__right">
                <span class="priority-pill" :class="priorityClass(task.priority)">
                  {{ task.priority }}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button class="task-item__menu-btn">
                      <MoreHorizontal :size="15" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="toggleTask(task.id)">
                      {{ task.done ? 'Mark as pending' : 'Mark as done' }}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-destructive"
                      @click="removeTask(task.id)"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          </ul>

          <!-- Add Task -->
          <div class="add-task">
            <button class="add-task__btn" @click="addTask">
              <Plus :size="14" />
              <span>Add a new task</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Right Column ────────────────────────────────────── -->
      <div class="right-col">

        <!-- Focus Session Card -->
        <Card class="focus-card">
          <CardContent class="focus-card__body">
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
              <Play :size="15" class="mr-2" />
              Start Timer
            </Button>
          </CardContent>
        </Card>

        <!-- Performance Chart -->
        <Card class="perf-card">
          <CardHeader class="perf-card__header">
            <CardTitle class="section-title">Recent Performance</CardTitle>
            <TrendingUp :size="16" class="perf-card__trend-icon" />
          </CardHeader>

          <CardContent class="perf-card__body">
            <div class="bar-chart">
              <div
                v-for="bar in performance"
                :key="bar.day"
                class="bar-chart__col"
              >
                <div class="bar-chart__track">
                  <div
                    class="bar-chart__fill"
                    :class="{ 'bar-chart__fill--active': bar.highlight }"
                    :style="{ height: bar.value + '%' }"
                  />
                </div>
                <span class="bar-chart__label">{{ bar.day }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Variables ──────────────────────────────────────────────────────────── */
:root {
  --blue:        #2563eb;
  --blue-light:  #eff6ff;
  --blue-mid:    #bfdbfe;
  --green:       #16a34a;
  --green-light: #dcfce7;
  --amber:       #d97706;
  --amber-light: #fef3c7;
  --red:         #dc2626;
  --red-light:   #fee2e2;
  --text:        #111827;
  --text-muted:  #6b7280;
  --border:      #e5e7eb;
  --surface:     #f9fafb;
}

/* ── Shell ──────────────────────────────────────────────────────────────── */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
  animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.dashboard__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.dashboard__greeting {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.dashboard__sub {
  margin-top: 4px;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.dashboard__sub strong {
  color: var(--text);
  font-weight: 600;
}

/* ── Stats ──────────────────────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  border: 1px solid var(--border);
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
  background: var(--blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card__icon {
  color: var(--blue);
}

/* Stat badge */
.stat-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 999px;
}

.stat-badge--blue   { background: var(--blue-light);  color: var(--blue);  }
.stat-badge--green  { background: var(--green-light); color: var(--green); }
.stat-badge--amber  { background: var(--amber-light); color: var(--amber); }

.stat-card__label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
}

.stat-card__value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.04em;
  line-height: 1;
}

.stat-card__sub {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72rem;
  color: var(--green);
  font-weight: 500;
}

.stat-card__trend-icon {
  color: var(--green);
}

/* ── Bottom Grid ────────────────────────────────────────────────────────── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  align-items: start;
}

/* ── Tasks Card ─────────────────────────────────────────────────────────── */
.tasks-card {
  border: 1px solid var(--border);
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
  color: var(--text);
}

.view-all-btn {
  font-size: 0.8rem;
  color: var(--blue);
  padding: 0 8px;
  height: auto;
}

.tasks-card__body {
  padding: 12px 20px 20px;
}

/* Task List */
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
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item--done .task-item__title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-item__check {
  flex-shrink: 0;
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
  color: var(--text);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.task-item__title:hover {
  color: var(--blue);
}

.task-item__sub {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.task-item__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Priority Pills */
.priority-pill {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 999px;
}

.priority--high   { background: var(--red-light);   color: var(--red);   }
.priority--medium { background: var(--amber-light);  color: var(--amber); }
.priority--low    { background: var(--green-light);  color: var(--green); }

.task-item__menu-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.task-item__menu-btn:hover {
  color: var(--text);
  background: var(--surface);
}

/* Add task */
.add-task {
  padding-top: 12px;
}

.add-task__btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.15s;
}

.add-task__btn:hover {
  color: var(--blue);
}

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
  overflow: hidden;
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

.focus-card__title {
  font-size: 1.55rem;
  font-weight: 800;
  color: #ffffff;
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

.focus-meta-item {
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
  color: #ffffff;
}

.focus-meta-divider {
  width: 1px;
  height: 32px;
  background: #3b82f6;
}

.focus-card__cta {
  margin-top: 4px;
  width: 100%;
  background: rgba(255,255,255,0.15);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.focus-card__cta:hover {
  background: rgba(255,255,255,0.25);
}

/* ── Performance Card ───────────────────────────────────────────────────── */
.perf-card {
  border: 1px solid var(--border);
  border-radius: 14px;
}

.perf-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 0;
}

.perf-card__trend-icon {
  color: var(--blue);
}

.perf-card__body {
  padding: 16px 20px 20px;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 100px;
}

.bar-chart__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.bar-chart__track {
  width: 100%;
  height: 80px;
  background: var(--surface);
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-chart__fill {
  width: 100%;
  background: var(--blue-mid);
  border-radius: 6px;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bar-chart__fill--active {
  background: var(--blue);
}

.bar-chart__label {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>