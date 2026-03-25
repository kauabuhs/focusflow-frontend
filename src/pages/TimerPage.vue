<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import {
  ChevronDown,
  Play,
  Square,
  Flame,
  Palette,
  Code2,
  Mail,
  RotateCcw,
} from 'lucide-vue-next'
import Button from '@/components/Button/Button.vue'
import Card from '@/components/Card/Card.vue'
import styles from './TimerPage.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────

interface Task {
  id: string
  label: string
}

interface Session {
  id: string
  icon: ReturnType<typeof Palette>
  iconBg: string
  iconColor: string
  title: string
  when: string
  duration: string
}

// ─── Constants ────────────────────────────────────────────────────────────

const DEFAULT_MINUTES = 25
const CIRCLE_R = 54
const CIRCLE_CIRC = 2 * Math.PI * CIRCLE_R

// ─── State ────────────────────────────────────────────────────────────────

const selectedTask = ref<Task | null>(null)
const totalSeconds = ref(DEFAULT_MINUTES * 60)
const remaining = ref(DEFAULT_MINUTES * 60)
const running = ref(false)
const sessionProgress = ref(65)

let timerRef: ReturnType<typeof setInterval> | null = null

const recentSessions = ref<Session[]>([
  {
    id: '1',
    icon: Palette,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    title: 'UI Refinement',
    when: 'TODAY · 2:45 PM',
    duration: '50m',
  },
  {
    id: '2',
    icon: Code2,
    iconBg: '#f5f3ff',
    iconColor: '#7c3aed',
    title: 'Backend Logic',
    when: 'TODAY · 11:20 AM',
    duration: '25m',
  },
  {
    id: '3',
    icon: Mail,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    title: 'Email Outreach',
    when: 'YESTERDAY · 4:15 PM',
    duration: '45m',
  },
])

// ─── Computed ─────────────────────────────────────────────────────────────

const displayMinutes = computed(() => String(Math.floor(remaining.value / 60)).padStart(2, '0'))
const displaySeconds = computed(() => String(remaining.value % 60).padStart(2, '0'))

const progressPct = computed(() =>
  totalSeconds.value > 0
    ? ((totalSeconds.value - remaining.value) / totalSeconds.value) * 100
    : 0
)

const ringOffset = computed(() =>
  CIRCLE_CIRC - (sessionProgress.value / 100) * CIRCLE_CIRC
)

// ─── Methods ──────────────────────────────────────────────────────────────

function startSession(): void {
  if (running.value) return
  running.value = true
  timerRef = setInterval(() => {
    if (remaining.value <= 0) {
      stopSession()
      return
    }
    remaining.value--
  }, 1000)
}

function stopSession(): void {
  running.value = false
  if (timerRef) {
    clearInterval(timerRef)
    timerRef = null
  }
}

function resetSession(): void {
  stopSession()
  remaining.value = totalSeconds.value
}

onUnmounted(() => {
  if (timerRef) clearInterval(timerRef)
})
</script>

<template>
  <div :class="styles['timer-page']">
    <!-- ── Focus Selector ────────────────────────────────────────────── -->
    <div :class="styles['focus-selector']">
      <p :class="styles['focus-selector__eyebrow']">CURRENT FOCUS</p>

      <button :class="styles['task-selector-btn']">
        <span :class="styles['task-selector-btn__label']">
          {{ selectedTask ? selectedTask.label : 'Select a task to focus on' }}
        </span>
        <ChevronDown :size="16" :class="styles['task-selector-btn__icon']" />
      </button>
    </div>

    <!-- ── Timer Display ─────────────────────────────────────────── -->
    <div :class="styles['timer-display']">
      <div :class="[styles['timer-clock'], running && styles['timer-clock--running']]">
        <span :class="styles['timer-clock__digits']">
          {{ displayMinutes }}<span :class="styles['timer-clock__colon']">:</span>{{ displaySeconds }}
        </span>
      </div>

      <!-- Focus Mode Active -->
      <div :class="styles['focus-mode-badge']">
        <Flame :size="14" :class="styles['focus-mode-badge__icon']" />
        <span>Focus Mode {{ running ? 'Active' : 'Ready' }}</span>
      </div>
    </div>

    <!-- ── Controls ──────────────────────────────────────────────────── -->
    <div :class="styles['timer-controls']">
      <Button
        :class="[styles['ctrl-btn'], styles['ctrl-btn--start']]"
        :disabled="running"
        @click="startSession"
      >
        <Play :size="16" />
        Start Session
      </Button>

      <Button
        :class="[styles['ctrl-btn'], styles['ctrl-btn--stop']]"
        :disabled="!running"
        @click="stopSession"
      >
        <Square :size="14" />
        Stop
      </Button>

      <button :class="[styles['ctrl-btn'], styles['ctrl-btn--reset']]" @click="resetSession">
        <RotateCcw :size="15" />
      </button>
    </div>

    <!-- ── Progress Bar ──────────────────────────────────────────── -->
    <div v-if="running || progressPct > 0" :class="styles['progress-wrap']">
      <div :class="styles['progress-bar']">
        <div
          :class="styles['progress-bar__fill']"
          :style="{ width: progressPct + '%' }"
        />
      </div>
      <span :class="styles['progress-pct']">{{ Math.round(progressPct) }}%</span>
    </div>

    <!-- ── Recent Sessions ───────────────────────────────────────── -->
    <Card :class="styles['sessions-card']">
      <!-- Header -->
      <div :class="styles['sessions-header']">
        <h3 :class="styles['sessions-title']">Recent Sessions</h3>
        <button :class="styles['view-all-btn']">VIEW ALL</button>
      </div>

      <!-- List -->
      <ul :class="styles['sessions-list']">
        <li
          v-for="session in recentSessions"
          :key="session.id"
          :class="styles['session-item']"
        >
          <div
            :class="styles['session-icon']"
            :style="{ background: session.iconBg }"
          >
            <component
              :is="session.icon"
              :size="15"
              :style="{ color: session.iconColor }"
            />
          </div>

          <div :class="styles['session-info']">
            <span :class="styles['session-title']">{{ session.title }}</span>
            <span :class="styles['session-when']">{{ session.when }}</span>
          </div>

          <span :class="styles['session-duration']">{{ session.duration }}</span>
        </li>
      </ul>
    </Card>

    <!-- ── Floating Progress Ring ────────────────────────────────── -->
    <div :class="styles['progress-ring-wrap']">
      <svg width="64" height="64" viewBox="0 0 128 128" :class="styles['progress-ring']">
        <circle
          cx="64"
          cy="64"
          :r="CIRCLE_R"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="10"
        />
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
          :class="styles['ring-progress']"
        />
      </svg>
      <span :class="styles['progress-ring__label']">{{ sessionProgress }}%</span>
    </div>
  </div>
</template>
