<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  LayoutGrid,
  Clock,
  Circle,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
} from 'lucide-vue-next'
import Button from '@/components/Button/Button.vue'
import Checkbox from '@/components/Checkbox/Checkbox.vue'
import Card from '@/components/Card/Card.vue'
import styles from './TasksPage.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'In Progress' | 'Todo' | 'Completed' | 'On Hold'
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

const ITEMS_PER_PAGE = 5

// ─── State ────────────────────────────────────────────────────────────────────

const viewMode = ref<ViewMode>('list')
const filterStatus = ref<Status | null>(null)
const filterTag = ref<string | null>(null)
const filterProject = ref<string | null>(null)
const currentPage = ref(1)
const timerMinutes = ref(25)
const timerSeconds = ref(0)
const timerRunning = ref(false)
const dailyProgress = ref(68)
let timerInterval: ReturnType<typeof setInterval> | null = null

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
    if (filterStatus.value && t.status !== filterStatus.value) return false
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

const statsCompleted = computed(() => tasks.value.filter(t => t.done).length)
const statsInProgress = computed(() => tasks.value.filter(t => t.status === 'In Progress').length)
const statsRemaining = computed(() => tasks.value.filter(t => !t.done).length)

// ─── Methods ──────────────────────────────────────────────────────────────────

function clearFilters(): void {
  filterStatus.value = null
  filterTag.value = null
  filterProject.value = null
  currentPage.value = 1
}

function toggleTask(id: string): void {
  const t = tasks.value.find(t => t.id === id)
  if (t) {
    t.done = !t.done
    t.selected = t.done
  }
}

function toggleAll(checked: boolean): void {
  pagedTasks.value.forEach(t => {
    t.selected = checked
    t.done = checked
  })
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

function statusIcon(s: Status) {
  return {
    'In Progress': Clock,
    'Todo': Circle,
    'Completed': CheckCircle2,
    'On Hold': AlertCircle,
  }[s]
}

function statusClass(s: Status): string {
  const map = {
    'In Progress': 'status--progress',
    'Todo': 'status--todo',
    'Completed': 'status--completed',
    'On Hold': 'status--hold',
  }
  return styles[map[s]] || ''
}

function priorityClass(p: Priority): string {
  const map = {
    HIGH: 'priority--high',
    MEDIUM: 'priority--medium',
    LOW: 'priority--low',
  }
  return styles[map[p]] || ''
}

function projectClass(tag: string): string {
  const map: Record<string, string> = {
    CORE: 'project-tag--blue',
    PRODUCT: 'project-tag--violet',
    STRATEGY: 'project-tag--amber',
    BACKEND: 'project-tag--slate',
    CPS: 'project-tag--teal',
    QA: 'project-tag--rose',
  }
  return styles[map[tag] ?? 'project-tag--blue']
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div :class="styles['tasks-page']">
    <!-- ── Page Header ──────────────────────────────────────────────────── -->
    <header :class="styles['page-header']">
      <div>
        <h1 :class="styles['page-title']">All Tasks</h1>
        <p :class="styles['page-sub']">Manage your productivity and focus flow.</p>
      </div>
      <Button :class="styles['new-task-btn']">
        <Plus :size="16" />
        New Task
      </Button>
    </header>

    <!-- ── Filters ───────────────────────────────────────────────────────── -->
    <div :class="styles['filters-bar']">
      <div :class="styles['filters-bar__left']">
        <!-- Status -->
        <button
          :class="[styles['filter-btn'], filterStatus && styles['filter-btn--active']]"
          @click="filterStatus = filterStatus ? null : 'In Progress'"
        >
          Status
          <ChevronDown :size="13" />
        </button>

        <!-- Tag -->
        <button
          :class="[styles['filter-btn'], filterTag && styles['filter-btn--active']]"
          @click="filterTag = filterTag ? null : 'Core'"
        >
          Tag
          <ChevronDown :size="13" />
        </button>

        <!-- Project -->
        <button
          :class="[styles['filter-btn'], filterProject && styles['filter-btn--active']]"
          @click="filterProject = filterProject ? null : 'Core Product'"
        >
          Project
          <ChevronDown :size="13" />
        </button>

        <!-- Clear -->
        <button v-if="hasFilters" :class="styles['clear-btn']" @click="clearFilters">
          <X :size="13" />
          Clear filters
        </button>
      </div>

      <div :class="styles['filters-bar__right']">
        <span :class="styles['display-count']">Displaying {{ filteredTasks.length }} tasks</span>

        <div :class="styles['view-toggle']">
          <button
            :class="[styles['view-toggle__btn'], viewMode === 'list' && styles['view-toggle__btn--active']]"
            @click="viewMode = 'list'"
          >
            <LayoutList :size="16" />
          </button>
          <button
            :class="[styles['view-toggle__btn'], viewMode === 'grid' && styles['view-toggle__btn--active']]"
            @click="viewMode = 'grid'"
          >
            <LayoutGrid :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Table ────────────────────────────────────────────────────────── -->
    <div :class="styles['table-wrap']">
      <table :class="styles['task-table']">
        <thead>
          <tr>
            <th :class="styles['col-check']">
              <Checkbox @update:checked="toggleAll" />
            </th>
            <th :class="styles['col-status']">STATUS</th>
            <th :class="styles['col-name']">TASK NAME</th>
            <th :class="styles['col-project']">PROJECT</th>
            <th :class="styles['col-date']">DUE DATE</th>
            <th :class="styles['col-priority']">PRIORITY</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in pagedTasks"
            :key="task.id"
            :class="[styles['task-row'], task.done && styles['task-row--done']]"
          >
            <td :class="styles['col-check']">
              <Checkbox
                :checked="task.selected"
                @update:checked="() => toggleTask(task.id)"
              />
            </td>

            <td :class="styles['col-status']">
              <div :class="[styles['status-cell'], statusClass(task.status)]">
                <component :is="statusIcon(task.status)" :size="13" />
                <span>{{ task.status }}</span>
              </div>
            </td>

            <td :class="styles['col-name']">
              <span :class="[styles['task-name'], task.done && styles['task-name--done']]">
                {{ task.name }}
              </span>
            </td>

            <td :class="styles['col-project']">
              <div :class="styles['project-tags']">
                <span
                  v-for="tag in task.project"
                  :key="tag"
                  :class="[styles['project-tag'], projectClass(tag)]"
                >
                  {{ tag }}
                </span>
              </div>
            </td>

            <td :class="styles['col-date']">
              <span :class="styles['due-date']">{{ task.dueDate }}</span>
            </td>

            <td :class="styles['col-priority']">
              <span :class="[styles['priority-pill'], priorityClass(task.priority)]">
                {{ task.priority }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Pagination ───────────────────────────────────────────────────── -->
    <div :class="styles['pagination']">
      <span :class="styles['pagination__info']">Page {{ currentPage }} of {{ totalPages }}</span>
      <div :class="styles['pagination__btns']">
        <button
          :class="styles['pagination__btn']"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <ChevronLeft :size="16" />
        </button>
        <button
          :class="styles['pagination__btn']"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- ── Bottom Row ───────────────────────────────────────────────────── -->
    <div :class="styles['bottom-row']">
      <!-- Deep Work Mode -->
      <Card :class="styles['deep-work-card']">
        <div :class="styles['deep-work-card__body']">
          <p :class="styles['deep-work-card__label']">Deep Work Mode</p>
          <Button :class="styles['deep-work-card__btn']">
            <Play :size="14" />
            Start Focus Session
          </Button>
        </div>
      </Card>

      <!-- Focus Timer Card -->
      <Card :class="styles['focus-timer-card']">
        <div :class="styles['focus-timer-card__body']">
          <div :class="styles['focus-timer-card__info']">
            <h3 :class="styles['focus-timer-card__title']">Upcoming Focus Session</h3>
            <p :class="styles['focus-timer-card__sub']">
              Boost your output with a timed sprint. Current task: <strong>"Design System Audit."</strong>
            </p>
          </div>

          <div :class="styles['timer-display']">
            <div :class="styles['timer-block']">
              <span :class="styles['timer-block__value']">{{ pad(timerMinutes) }}</span>
              <span :class="styles['timer-block__label']">MINUTES</span>
            </div>
            <span :class="styles['timer-colon']">:</span>
            <div :class="styles['timer-block']">
              <span :class="styles['timer-block__value']">{{ pad(timerSeconds) }}</span>
              <span :class="styles['timer-block__label']">SECONDS</span>
            </div>

            <button :class="styles['timer-play-btn']" @click="startTimer">
              <Play :size="18" />
            </button>
          </div>
        </div>
      </Card>

      <!-- Daily Progress -->
      <Card :class="styles['progress-card']">
        <div :class="styles['progress-card__body']">
          <div :class="styles['progress-card__header']">
            <span :class="styles['progress-card__label']">DAILY PROGRESS</span>
            <span :class="styles['progress-card__pct']">{{ dailyProgress }}%</span>
          </div>

          <div :class="styles['progress-bar']">
            <div
              :class="styles['progress-bar__fill']"
              :style="{ width: dailyProgress + '%' }"
            />
          </div>

          <ul :class="styles['progress-stats']">
            <li :class="[styles['progress-stat'], styles['progress-stat--green']]">
              <span :class="styles['progress-stat__dot']" />
              {{ statsCompleted }} Tasks Completed
            </li>
            <li :class="[styles['progress-stat'], styles['progress-stat--blue']]">
              <span :class="styles['progress-stat__dot']" />
              {{ statsInProgress }} Tasks In Progress
            </li>
            <li :class="[styles['progress-stat'], styles['progress-stat--gray']]">
              <span :class="styles['progress-stat__dot']" />
              {{ statsRemaining }} Tasks Remaining
            </li>
          </ul>
        </div>
      </Card>
    </div>
  </div>
</template>
