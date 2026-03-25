<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus, ChevronDown, ChevronLeft, ChevronRight,
  LayoutList, LayoutGrid, Clock, Circle, CheckCircle2,
  AlertCircle, X, Play,
} from 'lucide-vue-next'
import Button from '@/components/Button/Button.vue'
import Checkbox from '@/components/Checkbox/Checkbox.vue'
import Card from '@/components/Card/Card.vue'
import PageHeader from '@/components/common/PageHeader.vue'

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

const ITEMS_PER_PAGE = 5

// ─── State ────────────────────────────────────────────────────────────────────

const viewMode      = ref<ViewMode>('list')
const filterStatus  = ref<Status | null>(null)
const filterTag     = ref<string | null>(null)
const filterProject = ref<string | null>(null)
const currentPage   = ref(1)

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
    done: false 
  },

  { 
    id: '2', 
    status: 'Todo',        
    name: 'Quarterly Performance Review Preparation',   
    project: ['CPS'],             
    dueDate: 'Oct 26, 2023', 
    priority: 'MEDIUM', 
    selected: false, 
    done: false 
  },

  { 
    id: '3', 
    status: 'Completed',   
    name: 'Draft Q4 Strategic Roadmap',                  
    project: ['STRATEGY'],        
    dueDate: 'Oct 20, 2023', 
    priority: 'LOW',    
    selected: true,  
    done: true  
  },

  { 
    id: '4', 
    status: 'On Hold',     
    name: 'API Integration with Third-Party CRM',        
    project: ['BACKEND'],         
    dueDate: 'Nov 07, 2023', 
    priority: 'HIGH',  
    selected: false, 
    done: false 
    },

  { 
    id: '5', 
    status: 'In Progress', 
    name: 'Mobile App UI Polish & Micro-interactions',  
     project: ['CORE', 'PRODUCT'], 
     dueDate: 'Oct 25, 2023', 
     priority: 'MEDIUM', 
     selected: false, 
     done: false 
    },

  { 
    id: '6', 
    status: 'Todo',        
    name: 'User Research Sessions for Onboarding Flow',  
    project: ['PRODUCT'],         
    dueDate: 'Nov 10, 2023', 
    priority: 'MEDIUM', 
    selected: false, 
    done: false 
  },

  { 
    id: '7', 
    status: 'In Progress', 
    name: 'Backend Performance Optimization',            
    project: ['BACKEND'],         
    dueDate: 'Nov 03, 2023', 
    priority: 'HIGH',   
    selected: false, 
    done: false 
  },

  { 
    id: '8', 
    status: 'Completed',   
    name: 'Accessibility Audit - Mobile Views',          
    project: ['QA', 'CORE'],      
    dueDate: 'Oct 18, 2023', 
    priority: 'LOW',    
    selected: false, 
    done: true  
  },

])

// ─── Computed ─────────────────────────────────────────────────────────────────

const filteredTasks = computed<Task[]>(() =>
  tasks.value.filter(t => {
    if (filterStatus.value  && t.status !== filterStatus.value)                           return false
    if (filterProject.value && !t.project.includes(filterProject.value.toUpperCase())) return false
    return true
  })
)

const totalPages  = computed(() => Math.max(1, Math.ceil(filteredTasks.value.length / ITEMS_PER_PAGE)))
const pagedTasks  = computed<Task[]>(() => filteredTasks.value.slice((currentPage.value - 1) * ITEMS_PER_PAGE, currentPage.value * ITEMS_PER_PAGE))
const hasFilters  = computed(() => !!(filterStatus.value || filterTag.value || filterProject.value))

const statsCompleted  = computed(() => tasks.value.filter(t => t.done).length)
const statsInProgress = computed(() => tasks.value.filter(t => t.status === 'In Progress').length)
const statsRemaining  = computed(() => tasks.value.filter(t => !t.done).length)

// ─── Methods ──────────────────────────────────────────────────────────────────

function clearFilters(): void { filterStatus.value = null; filterTag.value = null; filterProject.value = null; currentPage.value = 1 }
function toggleTask(id: string): void { const t = tasks.value.find(t => t.id === id); if (t) { t.done = !t.done; t.selected = t.done } }
function toggleAll(checked: boolean): void { pagedTasks.value.forEach(t => { t.selected = checked; t.done = checked }) }
function prevPage(): void { if (currentPage.value > 1) currentPage.value-- }
function nextPage(): void { if (currentPage.value < totalPages.value) currentPage.value++ }

function startTimer(): void {
  if (timerRunning.value) { clearInterval(timerInterval!); timerRunning.value = false; return }
  timerRunning.value = true
  timerInterval = setInterval(() => {
    if (timerSeconds.value === 0) {
      if (timerMinutes.value === 0) { clearInterval(timerInterval!); timerRunning.value = false; return }
      timerMinutes.value--; timerSeconds.value = 59
    } else { timerSeconds.value-- }
  }, 1000)
}

function statusIcon(s: Status) {
  return { 
    'In Progress': Clock, 
    'Todo': Circle, 
    'Completed': CheckCircle2, 
    'On Hold': AlertCircle 
  }[s]
}

function statusClass(s: Status): string {
  return { 
    'In Progress': 'status--progress', 
    'Todo': 'status--todo', 
    'Completed': 'status--completed', 
    'On Hold': 'status--hold' 
  }[s]
}

function priorityClass(p: Priority): string {
  return { 
    HIGH: 'priority--high', 
    MEDIUM: 'priority--medium', 
    LOW: 'priority--low' 
  }[p]
}

function projectClass(tag: string): string {
  const map: Record<string, string> = { 
    CORE: 'tag--blue', 
    PRODUCT: 'tag--violet', 
    STRATEGY: 'tag--amber', 
    BACKEND: 'tag--slate', 
    CPS: 'tag--teal', 
    QA: 'tag--rose' 
  }

  return map[tag] ?? 'tag--blue'
}

function pad(n: number): string { return String(n).padStart(2, '0') }
</script>

<template>
  <div class="tasks-page">

    <!-- =========================
         📄 HEADER
    ========================== -->
    <PageHeader
      title="All Tasks"
      subtitle="Manage your productivity and focus flow."
    >
      <template #actions>
        <button class="new-task-btn">
          <Plus :size="15" />
          New Task
        </button>
      </template>
    </PageHeader>


    <!-- =========================
         🎛 FILTERS
    ========================== -->
    <div class="filters-bar">

      <!-- Left Filters -->
      <div class="filters-bar__left">

        <button
          class="filter-btn"
          :class="{ 'filter-btn--active': filterStatus }"
          @click="filterStatus = filterStatus ? null : 'In Progress'"
        >
          Status
          <ChevronDown :size="13" />
        </button>

        <button
          class="filter-btn"
          :class="{ 'filter-btn--active': filterTag }"
          @click="filterTag = filterTag ? null : 'Core'"
        >
          Tag
          <ChevronDown :size="13" />
        </button>

        <button
          class="filter-btn"
          :class="{ 'filter-btn--active': filterProject }"
          @click="filterProject = filterProject ? null : 'CORE'"
        >
          Project
          <ChevronDown :size="13" />
        </button>

        <button
          v-if="hasFilters"
          class="clear-btn"
          @click="clearFilters"
        >
          <X :size="13" />
          Clear filters
        </button>

      </div>

      <!-- Right Controls -->
      <div class="filters-bar__right">

        <span class="display-count">
          Displaying {{ filteredTasks.length }} tasks
        </span>

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


    <!-- =========================
         📊 TASK TABLE
    ========================== -->
    <div class="table-wrap">

      <table class="task-table">

        <!-- Table Head -->
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

        <!-- Table Body -->
        <tbody>
          <tr
            v-for="task in pagedTasks"
            :key="task.id"
            class="task-row"
            :class="{ 'task-row--done': task.done }"
          >
            <!-- Checkbox -->
            <td class="col-check">
              <Checkbox
                :checked="task.selected"
                @update:checked="() => toggleTask(task.id)"
              />
            </td>

            <!-- Status -->
            <td class="col-status">
              <div
                class="status-cell"
                :class="statusClass(task.status)"
              >
                <component
                  :is="statusIcon(task.status)"
                  :size="13"
                />
                <span>{{ task.status }}</span>
              </div>
            </td>

            <!-- Task Name -->
            <td class="col-name">
              <span
                class="task-name"
                :class="{ 'task-name--done': task.done }"
              >
                {{ task.name }}
              </span>
            </td>

            <!-- Project Tags -->
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
              <span class="due-date">
                {{ task.dueDate }}
              </span>
            </td>

            <!-- Priority -->
            <td class="col-priority">
              <span
                class="priority-pill"
                :class="priorityClass(task.priority)"
              >
                {{ task.priority }}
              </span>
            </td>

          </tr>
        </tbody>

      </table>
    </div>


    <!-- =========================
         🔢 PAGINATION
    ========================== -->
    <div class="pagination">

      <span class="pagination__info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <div class="pagination__btns">

        <button
          class="pagination__btn"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <ChevronLeft :size="16" />
        </button>

        <button
          class="pagination__btn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          <ChevronRight :size="16" />
        </button>

      </div>
    </div>


    <!-- =========================
         📦 BOTTOM DASHBOARD
    ========================== -->
    <div class="bottom-row">

      <!-- =====================
           🧠 DEEP WORK
      ====================== -->
      <Card class="deep-work-card">
        <div class="deep-work-card__body">

          <p class="deep-work-card__label">
            Deep Work Mode
          </p>

          <Button class="deep-work-card__btn">
            <Play :size="14" />
            Start Focus Session
          </Button>

        </div>
      </Card>


      <!-- =====================
           ⏱ TIMER
      ====================== -->
      <Card class="focus-timer-card">
        <div class="focus-timer-card__body">

          <!-- Info -->
          <div class="focus-timer-card__info">
            <h3 class="focus-timer-card__title">
              Upcoming Focus Session
            </h3>

            <p class="focus-timer-card__sub">
              Boost your output with a timed sprint.
              Current task:
              <strong>"Design System Audit."</strong>
            </p>
          </div>

          <!-- Timer -->
          <div class="timer-display">

            <div class="timer-block">
              <span class="timer-block__value">
                {{ pad(timerMinutes) }}
              </span>
              <span class="timer-block__label">
                MINUTES
              </span>
            </div>

            <span class="timer-colon">:</span>

            <div class="timer-block">
              <span class="timer-block__value">
                {{ pad(timerSeconds) }}
              </span>
              <span class="timer-block__label">
                SECONDS
              </span>
            </div>

            <button
              class="timer-play-btn"
              @click="startTimer"
            >
              <Play :size="18" />
            </button>

          </div>

        </div>
      </Card>


      <!-- =====================
           📈 PROGRESS
      ====================== -->
      <Card class="progress-card">
        <div class="progress-card__body">

          <!-- Header -->
          <div class="progress-card__header">
            <span class="progress-card__label">
              DAILY PROGRESS
            </span>

            <span class="progress-card__pct">
              {{ dailyProgress }}%
            </span>
          </div>

          <!-- Bar -->
          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :style="{ width: dailyProgress + '%' }"
            />
          </div>

          <!-- Stats -->
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

        </div>
      </Card>

    </div>

  </div>
</template>

<style scoped>

/* =========================
   📄 PAGE
========================= */
.tasks-page {
  display: flex;
  flex-direction: column;

  gap: 20px;

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


/* =========================
   ➕ NEW TASK BUTTON
========================= */
.new-task-btn {
  display: flex;
  align-items: center;

  gap: 6px;

  height: 38px;
  padding: 0 18px;

  border: none;
  border-radius: 10px;

  background: #2563eb;
  color: #fff;

  font-size: 0.875rem;
  font-weight: 600;

  cursor: pointer;
  flex-shrink: 0;

  transition: opacity 0.15s;
}

.new-task-btn:hover {
  opacity: 0.88;
}


/* =========================
   🎛 FILTERS BAR
========================= */
.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;
  flex-wrap: wrap;
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


/* =========================
   🔘 FILTER BUTTONS
========================= */
.filter-btn {
  display: flex;
  align-items: center;

  gap: 5px;
  padding: 6px 12px;

  border: 1px solid #e5e7eb;
  border-radius: 8px;

  background: #fff;
  color: #6b7280;

  font-size: 0.8rem;
  font-weight: 500;

  cursor: pointer;

  transition: border-color 0.15s, color 0.15s;
}

.filter-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.filter-btn--active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}


/* =========================
   🧹 CLEAR + META
========================= */
.clear-btn {
  display: flex;
  align-items: center;

  gap: 4px;
  padding: 6px 8px;

  border: none;
  border-radius: 6px;

  background: transparent;
  color: #6b7280;

  font-size: 0.78rem;

  cursor: pointer;

  transition: color 0.15s;
}

.clear-btn:hover {
  color: #dc2626;
}

.display-count {
  font-size: 0.78rem;
  color: #6b7280;

  white-space: nowrap;
}


/* =========================
   🔄 VIEW TOGGLE
========================= */
.view-toggle {
  display: flex;

  border: 1px solid #e5e7eb;
  border-radius: 8px;

  overflow: hidden;
}

.view-toggle__btn {
  display: flex;
  align-items: center;

  padding: 6px 10px;

  border: none;
  background: #fff;

  color: #6b7280;

  cursor: pointer;

  transition: background 0.15s, color 0.15s;
}

.view-toggle__btn + .view-toggle__btn {
  border-left: 1px solid #e5e7eb;
}

.view-toggle__btn--active {
  background: #eff6ff;
  color: #2563eb;
}


/* =========================
   📊 TABLE WRAPPER
========================= */
.table-wrap {
  background: #fff;

  border: 1px solid #e5e7eb;
  border-radius: 14px;

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.task-table {
  width: 100%;
  min-width: 780px;

  border-collapse: collapse;
}

.task-table thead tr {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.task-table th {
  padding: 10px 14px;

  font-size: 0.65rem;
  font-weight: 700;

  letter-spacing: 0.07em;
  color: #6b7280;

  text-align: left;
  white-space: nowrap;
}

.task-table td {
  padding: 13px 14px;

  vertical-align: middle;
}


/* =========================
   📏 TABLE COLUMNS
========================= */
.col-check   { width: 40px; }
.col-status  { width: 130px; }
.col-name    { min-width: 200px; }
.col-project { width: 130px; }
.col-date    { width: 110px; white-space: nowrap; }
.col-priority{ width: 90px; }


/* =========================
   📄 ROW STATES
========================= */
.task-row {
  border-bottom: 1px solid #e5e7eb;

  transition: background 0.12s;
}

.task-row:last-child {
  border-bottom: none;
}

.task-row:hover {
  background: #f9fafb;
}

.task-row--done {
  opacity: 0.55;
}


/* =========================
   🟢 STATUS
========================= */
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


/* =========================
   📝 TASK CONTENT
========================= */
.task-name {
  font-size: 0.875rem;
  font-weight: 500;

  color: #111827;
}

.task-name--done {
  text-decoration: line-through;
  color: #6b7280;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;

  gap: 4px;
}

.project-tag {
  padding: 2px 7px;

  font-size: 0.6rem;
  font-weight: 700;

  letter-spacing: 0.06em;

  border-radius: 5px;
}


/* =========================
   🎨 TAG COLORS
========================= */
.tag--blue   { background: #eff6ff; color: #2563eb; }
.tag--violet { background: #f5f3ff; color: #7c3aed; }
.tag--amber  { background: #fef3c7; color: #d97706; }
.tag--slate  { background: #f1f5f9; color: #475569; }
.tag--teal   { background: #f0fdfa; color: #0d9488; }
.tag--rose   { background: #fff1f2; color: #e11d48; }


/* =========================
   📅 META INFO
========================= */
.due-date {
  font-size: 0.8rem;
  color: #6b7280;
}

.priority-pill {
  padding: 3px 9px;

  font-size: 0.62rem;
  font-weight: 700;

  letter-spacing: 0.06em;

  border-radius: 999px;
}

.priority--high   { background: #fee2e2; color: #dc2626; }
.priority--medium { background: #fef3c7; color: #d97706; }
.priority--low    { background: #dcfce7; color: #16a34a; }


/* =========================
   🔢 PAGINATION
========================= */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 4px;
}

.pagination__info {
  font-size: 0.78rem;
  color: #6b7280;
}

.pagination__btns {
  display: flex;
  gap: 4px;
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  border: 1px solid #e5e7eb;
  border-radius: 7px;

  background: #fff;
  color: #6b7280;

  cursor: pointer;

  transition: border-color 0.15s, color 0.15s;
}

.pagination__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pagination__btn:not(:disabled):hover {
  border-color: #2563eb;
  color: #2563eb;
}


/* =========================
   📦 BOTTOM GRID
========================= */
.bottom-row {
  display: grid;
  grid-template-columns: 180px 1fr 220px;

  gap: 16px;
  align-items: stretch;
}


/* =========================
   🧠 DEEP WORK CARD
========================= */
.deep-work-card {
  background: #1e3a5f;

  border: none;
  border-radius: 14px;
}

.deep-work-card__body {
  display: flex;
  flex-direction: column;

  gap: 14px;
  height: 100%;

  padding: 20px 16px;
}

.deep-work-card__label {
  font-size: 0.7rem;
  font-weight: 700;

  letter-spacing: 0.06em;
  text-transform: uppercase;

  color: #93c5fd;
}

.deep-work-card__btn {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;
  padding: 9px 0;

  width: 100%;

  border: none;
  border-radius: 9px;

  background: #2563eb;
  color: #fff;

  font-size: 0.78rem;
  font-weight: 600;

  cursor: pointer;

  transition: opacity 0.15s;
}

.deep-work-card__btn:hover {
  opacity: 0.88;
}


/* =========================
   ⏱ FOCUS TIMER CARD
========================= */
.focus-timer-card {
  background: #1d4ed8;

  border: none;
  border-radius: 14px;
}

.focus-timer-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
  height: 100%;

  padding: 22px 24px;
}

.focus-timer-card__info {
  flex: 1;
}

.focus-timer-card__title {
  margin-bottom: 6px;

  font-size: 1.1rem;
  font-weight: 700;

  letter-spacing: -0.02em;
  color: #fff;
}

.focus-timer-card__sub {
  font-size: 0.78rem;
  line-height: 1.5;

  color: #bfdbfe;
}

.focus-timer-card__sub strong {
  color: #fff;
}


/* =========================
   ⏲ TIMER DISPLAY
========================= */
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

  min-width: 58px;
  padding: 10px 14px;

  border-radius: 10px;

  background: rgba(255,255,255,0.12);
}

.timer-block__value {
  font-size: 1.5rem;
  font-weight: 800;

  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;

  color: #fff;
}

.timer-block__label {
  margin-top: 2px;

  font-size: 0.5rem;
  font-weight: 700;

  letter-spacing: 0.08em;
  color: #93c5fd;
}

.timer-colon {
  margin-bottom: 8px;

  font-size: 1.4rem;
  font-weight: 800;

  color: #fff;
}

.timer-play-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  border-radius: 50%;

  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);

  color: #fff;

  cursor: pointer;

  transition: background 0.15s;
}

.timer-play-btn:hover {
  background: rgba(255,255,255,0.32);
}


/* =========================
   📈 PROGRESS CARD
========================= */
.progress-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.progress-card__body {
  display: flex;
  flex-direction: column;

  gap: 12px;
  padding: 20px;
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
  color: #6b7280;
}

.progress-card__pct {
  font-size: 0.9rem;
  font-weight: 800;

  color: #2563eb;
}

.progress-bar {
  width: 100%;
  height: 8px;

  border-radius: 999px;
  background: #e5e7eb;

  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;

  border-radius: 999px;

  background: linear-gradient(90deg, #2563eb, #3b82f6);

  transition: width 0.6s ease;
}

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
  font-weight: 500;

  color: #6b7280;
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


/* =========================
   📱 RESPONSIVE
========================= */
@media (max-width: 820px) {
  .bottom-row {
    grid-template-columns: 1fr;
  }

  .focus-timer-card__body {
    flex-direction: column;
    align-items: flex-start;
  }
}

</style>