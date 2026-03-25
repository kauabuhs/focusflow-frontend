<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  LayoutGrid,
  Play,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'

// ─── Types ────────────────────────────────────────────────────────────────────

type Status   = 'In Progress' | 'Todo' | 'Completed' | 'On Hold'
type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type ViewMode = 'list' | 'grid'

interface Task {
  id: string
  status: Status
  name: string
  project: string[]
  dueDate: string
  priority: Priority
  selected: boolean
  done: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: Status[]   = ['In Progress', 'Todo', 'Completed', 'On Hold']
const TAG_OPTIONS:    string[]   = ['Core', 'Product', 'Strategy', 'Backend', 'QA']
const PROJECT_OPTIONS: string[]  = ['Core Product', 'CPS', 'Strategy', 'Backend']

const ITEMS_PER_PAGE = 5

// ─── State ────────────────────────────────────────────────────────────────────

const viewMode        = ref<ViewMode>('list')
const filterStatus    = ref<Status | null>(null)
const filterTag       = ref<string | null>(null)
const filterProject   = ref<string | null>(null)
const currentPage     = ref(1)

// Countdown timer state
const timerMinutes = ref(25)
const timerSeconds = ref(0)
const timerRunning = ref(false)
let   timerInterval: ReturnType<typeof setInterval> | null = null

// Daily progress
const dailyProgress = ref(68)

const tasks = ref<Task[]>([
  {
    id: '1',
    status: 'In Progress',
    name: 'Design System Audit & Documentation',
    project: ['CORE', 'PRODUCT'],
    dueDate: 'Oct 24, 2023',
    priority: 'HIGH',
    selected: false,
    done: false,
  },
  {
    id: '2',
    status: 'Todo',
    name: 'Quarterly Performance Review Preparation',
    project: ['CPS'],
    dueDate: 'Oct 26, 2023',
    priority: 'MEDIUM',
    selected: false,
    done: false,
  },
  {
    id: '3',
    status: 'Completed',
    name: 'Draft Q4 Strategic Roadmap',
    project: ['STRATEGY'],
    dueDate: 'Oct 20, 2023',
    priority: 'LOW',
    selected: true,
    done: true,
  },
  {
    id: '4',
    status: 'On Hold',
    name: 'API Integration with Third-Party CRM',
    project: ['BACKEND'],
    dueDate: 'Nov 07, 2023',
    priority: 'HIGH',
    selected: false,
    done: false,
  },
  {
    id: '5',
    status: 'In Progress',
    name: 'Mobile App UI Polish & Micro-interactions',
    project: ['CORE', 'PRODUCT'],
    dueDate: 'Oct 25, 2023',
    priority: 'MEDIUM',
    selected: false,
    done: false,
  },
  {
    id: '6',
    status: 'Todo',
    name: 'User Research Sessions for Onboarding Flow',
    project: ['PRODUCT'],
    dueDate: 'Nov 10, 2023',
    priority: 'MEDIUM',
    selected: false,
    done: false,
  },
  {
    id: '7',
    status: 'In Progress',
    name: 'Backend Performance Optimization',
    project: ['BACKEND'],
    dueDate: 'Nov 03, 2023',
    priority: 'HIGH',
    selected: false,
    done: false,
  },
  {
    id: '8',
    status: 'Completed',
    name: 'Accessibility Audit - Mobile Views',
    project: ['QA', 'CORE'],
    dueDate: 'Oct 18, 2023',
    priority: 'LOW',
    selected: false,
    done: true,
  },
])

// ─── Computed ─────────────────────────────────────────────────────────────────

const filteredTasks = computed<Task[]>(() => {
  return tasks.value.filter(t => {
    if (filterStatus.value  && t.status !== filterStatus.value)               return false
    if (filterProject.value && !t.project.includes(filterProject.value.toUpperCase())) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredTasks.value.length / ITEMS_PER_PAGE))

const pagedTasks = computed<Task[]>(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredTasks.value.slice(start, start + ITEMS_PER_PAGE)
})

const hasFilters = computed(() =>
  filterStatus.value !== null || filterTag.value !== null || filterProject.value !== null
)

const statsCompleted   = computed(() => tasks.value.filter(t => t.done).length)
const statsInProgress  = computed(() => tasks.value.filter(t => t.status === 'In Progress').length)
const statsRemaining   = computed(() => tasks.value.filter(t => !t.done).length)

// ─── Methods ──────────────────────────────────────────────────────────────────

function clearFilters(): void {
  filterStatus.value  = null
  filterTag.value     = null
  filterProject.value = null
  currentPage.value   = 1
}

function toggleTask(id: string): void {
  const t = tasks.value.find(t => t.id === id)
  if (t) { t.done = !t.done; t.selected = t.done }
}

function toggleAll(checked: boolean): void {
  pagedTasks.value.forEach(t => { t.selected = checked; t.done = checked })
}

function prevPage(): void {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage(): void {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function startTimer(): void {
  if (timerRunning.value) {
    clearInterval(timerInterval!)
    timerRunning.value = false
    return
  }
  timerRunning.value = true
  timerInterval = setInterval(() => {
    if (timerSeconds.value === 0) {
      if (timerMinutes.value === 0) {
        clearInterval(timerInterval!)
        timerRunning.value = false
        return
      }
      timerMinutes.value--
      timerSeconds.value = 59
    } else {
      timerSeconds.value--
    }
  }, 1000)
}

function resetTimer(): void {
  clearInterval(timerInterval!)
  timerRunning.value = false
  timerMinutes.value = 25
  timerSeconds.value = 0
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusIcon(s: Status) {
  return {
    'In Progress': Clock,
    'Todo':        Circle,
    'Completed':   CheckCircle2,
    'On Hold':     AlertCircle,
  }[s]
}

function statusClass(s: Status): string {
  return {
    'In Progress': 'status--progress',
    'Todo':        'status--todo',
    'Completed':   'status--completed',
    'On Hold':     'status--hold',
  }[s]
}

function priorityClass(p: Priority): string {
  return {
    HIGH:   'priority--high',
    MEDIUM: 'priority--medium',
    LOW:    'priority--low',
  }[p]
}

function projectClass(tag: string): string {
  const map: Record<string, string> = {
    CORE:     'tag--blue',
    PRODUCT:  'tag--violet',
    STRATEGY: 'tag--amber',
    BACKEND:  'tag--slate',
    CPS:      'tag--teal',
    QA:       'tag--rose',
  }
  return map[tag] ?? 'tag--blue'
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div class="tasks-page">

    <!-- ── Page Header ───────────────────────────────────────────────────── -->
    <header class="page-header">
      <div>
        <h1 class="page-title">All Tasks</h1>
        <p class="page-sub">Manage your productivity and focus flow.</p>
      </div>

      <Button class="new-task-btn">
        <Plus :size="16" class="mr-1" />
        New Task
      </Button>
    </header>

    <!-- ── Filters ───────────────────────────────────────────────────────── -->
    <div class="filters-bar">
      <div class="filters-bar__left">

        <!-- Status -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="filter-btn" :class="{ 'filter-btn--active': filterStatus }">
              Status
              <ChevronDown :size="13" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              v-for="s in STATUS_OPTIONS"
              :key="s"
              @click="filterStatus = s; currentPage = 1"
            >
              {{ s }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Tag -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="filter-btn" :class="{ 'filter-btn--active': filterTag }">
              Tag
              <ChevronDown :size="13" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              v-for="t in TAG_OPTIONS"
              :key="t"
              @click="filterTag = t; currentPage = 1"
            >
              {{ t }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Project -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="filter-btn" :class="{ 'filter-btn--active': filterProject }">
              Project
              <ChevronDown :size="13" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              v-for="p in PROJECT_OPTIONS"
              :key="p"
              @click="filterProject = p; currentPage = 1"
            >
              {{ p }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Clear -->
        <button v-if="hasFilters" class="clear-btn" @click="clearFilters">
          <X :size="13" />
          Clear filters
        </button>
      </div>

      <div class="filters-bar__right">
        <span class="display-count">Displaying {{ filteredTasks.length }} tasks</span>

        <div class="view-toggle">
          <button
            class="view-toggle__btn"
            :class="{ 'view-toggle__btn--active': viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <LayoutList :size="16" />
          </button>
          <button
            class="view-toggle__btn"
            :class="{ 'view-toggle__btn--active': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <LayoutGrid :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Table ─────────────────────────────────────────────────────────── -->
    <div class="table-wrap">
      <table class="task-table">
        <thead>
          <tr>
            <th class="col-check">
              <Checkbox @update:checked="toggleAll" />
            </th>
            <th class="col-status">STATUS</th>
            <th class="col-name">TASK NAME</th>
            <th class="col-project">PROJECT</th>
            <th class="col-date">DUE DATE</th>
            <th class="col-priority">PRIORITY</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in pagedTasks"
            :key="task.id"
            class="task-row"
            :class="{ 'task-row--done': task.done }"
          >
            <!-- Check -->
            <td class="col-check">
              <Checkbox
                :checked="task.selected"
                @update:checked="() => toggleTask(task.id)"
              />
            </td>

            <!-- Status -->
            <td class="col-status">
              <div class="status-cell" :class="statusClass(task.status)">
                <component :is="statusIcon(task.status)" :size="13" />
                <span>{{ task.status }}</span>
              </div>
            </td>

            <!-- Name -->
            <td class="col-name">
              <span class="task-name" :class="{ 'task-name--done': task.done }">
                {{ task.name }}
              </span>
            </td>

            <!-- Project -->
            <td class="col-project">
              <div class="project-tags">
                <span
                  v-for="tag in task.project"
                  :key="tag"
                  class="project-tag"
                  :class="projectClass(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </td>

            <!-- Due Date -->
            <td class="col-date">
              <span class="due-date">{{ task.dueDate }}</span>
            </td>

            <!-- Priority -->
            <td class="col-priority">
              <span class="priority-pill" :class="priorityClass(task.priority)">
                {{ task.priority }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Pagination ────────────────────────────────────────────────────── -->
    <div class="pagination">
      <span class="pagination__info">Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="pagination__btns">
        <button class="pagination__btn" :disabled="currentPage === 1" @click="prevPage">
          <ChevronLeft :size="16" />
        </button>
        <button class="pagination__btn" :disabled="currentPage === totalPages" @click="nextPage">
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- ── Bottom Row ────────────────────────────────────────────────────── -->
    <div class="bottom-row">

      <!-- Deep Work Mode -->
      <Card class="deep-work-card">
        <CardContent class="deep-work-card__body">
          <p class="deep-work-card__label">Deep Work Mode</p>
          <Button class="deep-work-card__btn">
            <Play :size="14" class="mr-1" />
            Start Focus Session
          </Button>
        </CardContent>
      </Card>

      <!-- Focus Timer Card -->
      <Card class="focus-timer-card">
        <CardContent class="focus-timer-card__body">
          <div class="focus-timer-card__info">
            <h3 class="focus-timer-card__title">Upcoming Focus Session</h3>
            <p class="focus-timer-card__sub">
              Boost your output with a timed sprint. Current task:
              <strong>"Design System Audit."</strong>
            </p>
          </div>

          <div class="timer-display">
            <div class="timer-block">
              <span class="timer-block__value">{{ pad(timerMinutes) }}</span>
              <span class="timer-block__label">MINUTES</span>
            </div>
            <span class="timer-colon">:</span>
            <div class="timer-block">
              <span class="timer-block__value">{{ pad(timerSeconds) }}</span>
              <span class="timer-block__label">SECONDS</span>
            </div>

            <button class="timer-play-btn" @click="startTimer">
              <Play :size="18" />
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Daily Progress -->
      <Card class="progress-card">
        <CardContent class="progress-card__body">
          <div class="progress-card__header">
            <span class="progress-card__label">DAILY PROGRESS</span>
            <span class="progress-card__pct">{{ dailyProgress }}%</span>
          </div>

          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :style="{ width: dailyProgress + '%' }"
            />
          </div>

          <ul class="progress-stats">
            <li class="progress-stat progress-stat--green">
              <span class="progress-stat__dot" />
              {{ statsCompleted }} Tasks Completed
            </li>
            <li class="progress-stat progress-stat--blue">
              <span class="progress-stat__dot" />
              {{ statsInProgress }} Tasks In Progress
            </li>
            <li class="progress-stat progress-stat--gray">
              <span class="progress-stat__dot" />
              {{ statsRemaining }} Tasks Remaining
            </li>
          </ul>
        </CardContent>
      </Card>

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
.tasks-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 980px;
  margin: 0 auto;
  animation: fadeUp 0.35s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ── Page Header ────────────────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
}

.page-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 3px;
}

.new-task-btn {
  background: var(--blue);
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 10px;
  padding: 0 18px;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.15s;
}
.new-task-btn:hover { opacity: 0.88; }

/* ── Filters Bar ────────────────────────────────────────────────────────── */
.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filters-bar__left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filters-bar__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.filter-btn:hover       { border-color: var(--blue); color: var(--blue); }
.filter-btn--active     { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }

.clear-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: color 0.15s;
}
.clear-btn:hover { color: var(--red); }

.display-count {
  font-size: 0.78rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.view-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.view-toggle__btn {
  padding: 6px 10px;
  background: #fff;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
}
.view-toggle__btn + .view-toggle__btn { border-left: 1px solid var(--border); }
.view-toggle__btn--active { background: var(--blue-light); color: var(--blue); }

/* ── Table ──────────────────────────────────────────────────────────────── */
.table-wrap {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
}

.task-table thead tr {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.task-table th {
  padding: 10px 14px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: var(--text-muted);
  text-align: left;
  white-space: nowrap;
}

.task-row {
  border-bottom: 1px solid var(--border);
  transition: background 0.12s;
}
.task-row:last-child    { border-bottom: none; }
.task-row:hover         { background: var(--surface); }
.task-row--done         { opacity: 0.55; }

.task-table td {
  padding: 13px 14px;
  vertical-align: middle;
}

.col-check    { width: 40px; }
.col-status   { width: 130px; }
.col-name     { min-width: 220px; }
.col-project  { width: 130px; }
.col-date     { width: 110px; white-space: nowrap; }
.col-priority { width: 90px; }

/* Status cell */
.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}
.status--progress  { background: #eff6ff; color: #2563eb; }
.status--todo      { background: #f3f4f6; color: #6b7280; }
.status--completed { background: #dcfce7; color: #16a34a; }
.status--hold      { background: #fee2e2; color: #dc2626; }

/* Task name */
.task-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}
.task-name--done {
  text-decoration: line-through;
  color: var(--text-muted);
}

/* Project tags */
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.project-tag {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 5px;
}
.tag--blue   { background: #eff6ff; color: #2563eb; }
.tag--violet { background: #f5f3ff; color: #7c3aed; }
.tag--amber  { background: #fef3c7; color: #d97706; }
.tag--slate  { background: #f1f5f9; color: #475569; }
.tag--teal   { background: #f0fdfa; color: #0d9488; }
.tag--rose   { background: #fff1f2; color: #e11d48; }

/* Due date */
.due-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Priority pill */
.priority-pill {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 3px 9px;
  border-radius: 999px;
}
.priority--high   { background: #fee2e2; color: #dc2626; }
.priority--medium { background: #fef3c7; color: #d97706; }
.priority--low    { background: #dcfce7; color: #16a34a; }

/* ── Pagination ─────────────────────────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}
.pagination__info {
  font-size: 0.78rem;
  color: var(--text-muted);
}
.pagination__btns {
  display: flex;
  gap: 4px;
}
.pagination__btn {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: border-color 0.15s, color 0.15s;
}
.pagination__btn:disabled { opacity: 0.35; cursor: not-allowed; }
.pagination__btn:not(:disabled):hover { border-color: var(--blue); color: var(--blue); }

/* ── Bottom Row ─────────────────────────────────────────────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 180px 1fr 220px;
  gap: 16px;
  align-items: stretch;
}

/* Deep Work Card */
.deep-work-card {
  background: #1e3a5f;
  border: none;
  border-radius: 14px;
}
.deep-work-card__body {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
}
.deep-work-card__label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #93c5fd;
  text-transform: uppercase;
}
.deep-work-card__btn {
  background: var(--blue);
  color: #fff;
  font-weight: 600;
  font-size: 0.78rem;
  border-radius: 9px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 9px 0;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.deep-work-card__btn:hover { opacity: 0.88; }

/* Focus Timer Card */
.focus-timer-card {
  background: #1d4ed8;
  border: none;
  border-radius: 14px;
}
.focus-timer-card__body {
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 100%;
}
.focus-timer-card__info {
  flex: 1;
}
.focus-timer-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}
.focus-timer-card__sub {
  font-size: 0.78rem;
  color: #bfdbfe;
  margin-top: 6px;
  line-height: 1.5;
}
.focus-timer-card__sub strong {
  color: #fff;
}

/* Timer Display */
.timer-display {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.timer-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 60px;
}
.timer-block__value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.timer-block__label {
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #93c5fd;
  margin-top: 2px;
}
.timer-colon {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}
.timer-play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.timer-play-btn:hover { background: rgba(255,255,255,0.32); }

/* Progress Card */
.progress-card {
  border: 1px solid var(--border);
  border-radius: 14px;
}
.progress-card__body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.progress-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.progress-card__label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}
.progress-card__pct {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--blue);
}
.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--border);
  border-radius: 999px;
  overflow: hidden;
}
.progress-bar__fill {
  height: 100%;
  background: var(--blue);
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Progress Stats */
.progress-stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.progress-stat {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
}
.progress-stat__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.progress-stat--green .progress-stat__dot { background: #16a34a; }
.progress-stat--blue  .progress-stat__dot { background: #2563eb; }
.progress-stat--gray  .progress-stat__dot { background: #9ca3af; }

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 820px) {
  .bottom-row { grid-template-columns: 1fr; }
  .focus-timer-card__body { flex-direction: column; align-items: flex-start; }
}
</style>