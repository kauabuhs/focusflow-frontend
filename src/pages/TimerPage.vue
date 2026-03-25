<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { ChevronDown, Play, Square, Flame, Palette, Code2, Mail, RotateCcw } from 'lucide-vue-next'
// import Button from '@/components/Button/Button.vue'
import Card from '@/components/Card/Card.vue'
import PageHeader from '@/components/common/PageHeader.vue'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task { 
  id: string; 
  label: string 
}

interface Session { 
  id: string; 
  icon: ReturnType<typeof Palette>; 
  iconBg: string; 
  iconColor: string; 
  title: string; 
  when: string; 
  duration: string 
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_MINUTES = 25
const CIRCLE_R        = 54
const CIRCLE_CIRC     = 2 * Math.PI * CIRCLE_R

// ─── State ────────────────────────────────────────────────────────────────────

const tasks = ref<Task[]>([
  { id: '1', label: 'Finalize Q3 design system documentation' },
  { id: '2', label: 'Review engineering handoff files'        },
  { id: '3', label: 'Sync with stakeholders for feedback'     },
  { id: '4', label: 'Audit accessibility on mobile views'     },
])

const selectedTask    = ref<Task | null>(null)
const dropdownOpen    = ref(false)
const totalSeconds    = ref(DEFAULT_MINUTES * 60)
const remaining       = ref(DEFAULT_MINUTES * 60)
const running         = ref(false)
const sessionProgress = ref(65)

let timerRef: ReturnType<typeof setInterval> | null = null

const recentSessions = ref<Session[]>([
  { id: '1', icon: Palette, iconBg: '#eff6ff', iconColor: '#2563eb', title: 'UI Refinement',  when: 'TODAY · 2:45 PM',    duration: '50m' },
  { id: '2', icon: Code2,   iconBg: '#f5f3ff', iconColor: '#7c3aed', title: 'Backend Logic',  when: 'TODAY · 11:20 AM',   duration: '25m' },
  { id: '3', icon: Mail,    iconBg: '#f0fdf4', iconColor: '#16a34a', title: 'Email Outreach', when: 'YESTERDAY · 4:15 PM', duration: '45m' },
])

// ─── Computed ─────────────────────────────────────────────────────────────────

const displayMinutes = computed(() => String(Math.floor(remaining.value / 60)).padStart(2, '0'))
const displaySeconds = computed(() => String(remaining.value % 60).padStart(2, '0'))
const progressPct    = computed(() => totalSeconds.value > 0 ? ((totalSeconds.value - remaining.value) / totalSeconds.value) * 100 : 0)
const ringOffset     = computed(() => CIRCLE_CIRC - (sessionProgress.value / 100) * CIRCLE_CIRC)

// ─── Methods ──────────────────────────────────────────────────────────────────

function selectTask(task: Task): void { selectedTask.value = task; dropdownOpen.value = false }

function startSession(): void {
  if (running.value) return
  running.value = true
  timerRef = setInterval(() => {
    if (remaining.value <= 0) { stopSession(); return }
    remaining.value--
  }, 1000)
}

function stopSession(): void {
  running.value = false
  if (timerRef) { clearInterval(timerRef); timerRef = null }
}

function resetSession(): void { stopSession(); remaining.value = totalSeconds.value }

onUnmounted(() => { if (timerRef) clearInterval(timerRef) })
</script>

<template>
  <div class="timer-page">

    <!-- =========================
         📄 HEADER
    ========================== -->
    <PageHeader
      title="Focus Timer"
      subtitle="Run a distraction-free session and track your focus streak."
    />


    <!-- =========================
         🎯 FOCUS SELECTOR
    ========================== -->
    <div class="focus-selector">

      <!-- Label -->
      <p class="focus-selector__eyebrow">
        CURRENT FOCUS
      </p>

      <!-- Dropdown -->
      <div class="task-dropdown-wrap">

        <!-- Trigger -->
        <button
          class="task-selector-btn"
          @click="dropdownOpen = !dropdownOpen"
        >
          <span class="task-selector-btn__label">
            {{ selectedTask ? selectedTask.label : 'Select a task to focus on' }}
          </span>

          <ChevronDown
            :size="16"
            class="task-selector-btn__icon"
            :class="{ 'icon--open': dropdownOpen }"
          />
        </button>

        <!-- Menu -->
        <div
          v-if="dropdownOpen"
          class="task-dropdown"
        >
          <button
            v-for="task in tasks"
            :key="task.id"
            class="task-dropdown__item"
            @click="selectTask(task)"
          >
            {{ task.label }}
          </button>
        </div>

      </div>
    </div>


    <!-- =========================
         ⏱ TIMER DISPLAY
    ========================== -->
    <div class="timer-display">

      <!-- Clock -->
      <div
        class="timer-clock"
        :class="{ 'timer-clock--running': running }"
      >
        <span class="timer-clock__digits">
          {{ displayMinutes }}
          <span class="timer-clock__colon">:</span>
          {{ displaySeconds }}
        </span>
      </div>

      <!-- Status -->
      <div class="focus-mode-badge">
        <Flame
          :size="14"
          class="focus-mode-badge__icon"
        />

        <span>
          Focus Mode {{ running ? 'Active' : 'Ready' }}
        </span>
      </div>

    </div>


    <!-- =========================
         🎮 CONTROLS
    ========================== -->
    <div class="timer-controls">

      <button
        class="ctrl-btn ctrl-btn--start"
        :disabled="running"
        @click="startSession"
      >
        <Play :size="16" />
        Start Session
      </button>

      <button
        class="ctrl-btn ctrl-btn--stop"
        :disabled="!running"
        @click="stopSession"
      >
        <Square :size="14" />
        Stop
      </button>

      <button
        class="ctrl-btn ctrl-btn--reset"
        @click="resetSession"
      >
        <RotateCcw :size="15" />
      </button>

    </div>


    <!-- =========================
         📊 PROGRESS BAR
    ========================== -->
    <div
      v-if="running || progressPct > 0"
      class="progress-wrap"
    >
      <div class="progress-bar">
        <div
          class="progress-bar__fill"
          :style="{ width: progressPct + '%' }"
        />
      </div>

      <span class="progress-pct">
        {{ Math.round(progressPct) }}%
      </span>
    </div>


    <!-- =========================
         📋 RECENT SESSIONS
    ========================== -->
    <Card class="sessions-card">

      <!-- Header -->
      <div class="sessions-header">
        <h3 class="sessions-title">
          Recent Sessions
        </h3>

        <button class="view-all-btn">
          VIEW ALL
        </button>
      </div>

      <!-- List -->
      <ul class="sessions-list">

        <li
          v-for="session in recentSessions"
          :key="session.id"
          class="session-item"
        >
          <!-- Icon -->
          <div
            class="session-icon"
            :style="{ background: session.iconBg }"
          >
            <component
              :is="session.icon"
              :size="15"
              :style="{ color: session.iconColor }"
            />
          </div>

          <!-- Info -->
          <div class="session-info">
            <span class="session-title">
              {{ session.title }}
            </span>

            <span class="session-when">
              {{ session.when }}
            </span>
          </div>

          <!-- Duration -->
          <span class="session-duration">
            {{ session.duration }}
          </span>
        </li>

      </ul>
    </Card>


    <!-- =========================
         🔵 FLOATING PROGRESS RING
    ========================== -->
    <div class="progress-ring-wrap">

      <svg
        width="64"
        height="64"
        viewBox="0 0 128 128"
        class="progress-ring"
      >
        <!-- Background -->
        <circle
          cx="64"
          cy="64"
          :r="CIRCLE_R"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="10"
        />

        <!-- Progress -->
        <circle
          cx="64"
          cy="64"
          :r="CIRCLE_R"
          fill="none"
          stroke="#2563eb"
          stroke-width="10"
          stroke-linecap="round"
          :stroke-dasharray="CIRCLE_CIRC"
          :stroke-dashoffset="ringOffset"
          transform="rotate(-90 64 64)"
          class="ring-progress"
        />
      </svg>

      <!-- Label -->
      <span class="progress-ring__label">
        {{ sessionProgress }}%
      </span>

    </div>

  </div>
</template>

<style scoped>

/* =========================
   📄 PAGE
========================= */
.timer-page {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 28px;

  max-width: 580px;
  margin: 0 auto;
  padding-bottom: 40px;

  position: relative;

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
   🎯 SELECTOR
========================= */
.focus-selector {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
  width: 100%;
}

.focus-selector__eyebrow {
  font-size: 0.62rem;
  font-weight: 700;

  letter-spacing: 0.12em;
  color: #6b7280;
}

.task-dropdown-wrap {
  position: relative;

  width: 100%;
  max-width: 380px;
}


/* =========================
   🔘 SELECT BUTTON
========================= */
.task-selector-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 8px;

  width: 100%;
  padding: 10px 16px;

  border: 1px solid #e5e7eb;
  border-radius: 10px;

  background: #fff;
  cursor: pointer;

  font-size: 0.875rem;
  color: #6b7280;

  transition: border-color 0.15s, box-shadow 0.15s;
}

.task-selector-btn:hover {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px #2563eb14;
}

.task-selector-btn__label {
  flex: 1;

  text-align: left;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-selector-btn__icon {
  flex-shrink: 0;

  color: #6b7280;
  transition: transform 0.2s;
}

.icon--open {
  transform: rotate(180deg);
}


/* =========================
   📂 DROPDOWN
========================= */
.task-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;

  background: #fff;

  border: 1px solid #e5e7eb;
  border-radius: 10px;

  box-shadow: 0 8px 24px rgba(0,0,0,0.1);

  z-index: 20;
  overflow: hidden;
}

.task-dropdown__item {
  display: block;
  width: 100%;

  padding: 10px 16px;

  text-align: left;

  border: none;
  background: transparent;

  font-size: 0.875rem;
  color: #111827;

  cursor: pointer;

  transition: background 0.1s;
}

.task-dropdown__item:hover {
  background: #f9fafb;
}


/* =========================
   ⏱ TIMER DISPLAY
========================= */
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 14px;
  padding: 10px 0;
}

.timer-clock {
  position: relative;
}

.timer-clock__digits {
  display: flex;
  align-items: baseline;

  font-size: clamp(5rem, 14vw, 7.5rem);
  font-weight: 900;

  color: #0f172a;

  letter-spacing: -0.06em;
  font-variant-numeric: tabular-nums;

  line-height: 1;

  transition: color 0.3s;
}

.timer-clock--running .timer-clock__digits {
  color: #2563eb;
}

.timer-clock__colon {
  margin: 0 4px;

  animation: blink 1s step-start infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
}

.focus-mode-badge {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  font-size: 0.78rem;
  font-weight: 600;

  color: #6b7280;
}

.focus-mode-badge__icon {
  color: #f97316;
}


/* =========================
   🎮 CONTROLS
========================= */
.timer-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  gap: 10px;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  height: 46px;
  padding: 0 28px;

  border-radius: 12px;

  font-weight: 600;
  font-size: 0.9rem;

  border: none;
  cursor: pointer;

  font-family: inherit;

  transition: opacity 0.15s, transform 0.1s;
}

.ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ctrl-btn:not(:disabled):active {
  transform: scale(0.97);
}

.ctrl-btn--start {
  background: #2563eb;
  color: #fff;
}

.ctrl-btn--start:not(:disabled):hover {
  opacity: 0.88;
}

.ctrl-btn--stop {
  background: #1e293b;
  color: #fff;
}

.ctrl-btn--stop:not(:disabled):hover {
  opacity: 0.82;
}

.ctrl-btn--reset {
  width: 46px;
  height: 46px;
  padding: 0;

  border-radius: 12px;

  border: 1px solid #e5e7eb;
  background: #fff;

  color: #6b7280;

  transition: border-color 0.15s, color 0.15s;
}

.ctrl-btn--reset:hover {
  border-color: #2563eb;
  color: #2563eb;
}


/* =========================
   📊 PROGRESS BAR
========================= */
.progress-wrap {
  display: flex;
  align-items: center;

  gap: 10px;

  width: 100%;
  max-width: 400px;
}

.progress-bar {
  flex: 1;
  height: 6px;

  background: #e5e7eb;
  border-radius: 999px;

  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;

  background: #2563eb;
  border-radius: 999px;

  transition: width 1s linear;
}

.progress-pct {
  min-width: 32px;

  font-size: 0.72rem;
  font-weight: 700;

  color: #2563eb;

  text-align: right;
}


/* =========================
   📋 SESSIONS
========================= */
.sessions-card {
  width: 100%;

  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.sessions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 24px 0;
  margin-bottom: 16px;
}

.sessions-title {
  font-size: 0.95rem;
  font-weight: 700;

  color: #111827;
}

.view-all-btn {
  font-size: 0.68rem;
  font-weight: 700;

  letter-spacing: 0.07em;

  color: #2563eb;
  background: transparent;

  border: none;
  cursor: pointer;

  transition: opacity 0.15s;
}

.view-all-btn:hover {
  opacity: 0.7;
}

.sessions-list {
  list-style: none;

  margin: 0;
  padding: 0 24px 20px;

  display: flex;
  flex-direction: column;
}

.session-item {
  display: flex;
  align-items: center;

  gap: 14px;
  padding: 13px 0;

  border-bottom: 1px solid #e5e7eb;
}

.session-item:last-child {
  border-bottom: none;
}

.session-icon {
  width: 36px;
  height: 36px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
}

.session-info {
  display: flex;
  flex-direction: column;

  gap: 2px;
  flex: 1;

  min-width: 0;
}

.session-title {
  font-size: 0.875rem;
  font-weight: 600;

  color: #111827;
}

.session-when {
  font-size: 0.7rem;
  font-weight: 500;

  color: #6b7280;
  letter-spacing: 0.03em;
}

.session-duration {
  font-size: 0.9rem;
  font-weight: 700;

  color: #111827;

  flex-shrink: 0;
}


/* =========================
   🔵 PROGRESS RING
========================= */
.progress-ring-wrap {
  position: fixed;
  bottom: 28px;
  right: 28px;

  width: 64px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  border-radius: 50%;

  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
}

.ring-progress {
  transition: stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1);
}

.progress-ring__label {
  position: relative;

  font-size: 0.65rem;
  font-weight: 800;

  color: #2563eb;

  z-index: 1;
}

</style>