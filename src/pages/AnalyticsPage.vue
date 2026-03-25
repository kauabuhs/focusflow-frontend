<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'
import Card from '@/components/Card/Card.vue'
import styles from './AnalyticsPage.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────

type PeriodMode = 'week' | 'month'

interface FocusBar {
  day: string
  value: number
  active: boolean
}

interface ProjectSlice {
  label: string
  pct: number
  color: string
}

interface TrendPoint {
  week: string
  value: number
}

// ─── State ────────────────────────────────────────────────────────────────

const periodMode = ref<PeriodMode>('week')

const focusBarsWeek = ref<FocusBar[]>([
  { day: 'Mon', value: 55, active: false },
  { day: 'Tue', value: 82, active: false },
  { day: 'Wed', value: 38, active: false },
  { day: 'Thu', value: 90, active: true },
  { day: 'Fri', value: 72, active: false },
  { day: 'Sat', value: 28, active: false },
  { day: 'Sun', value: 45, active: false },
])

const focusBarsMonth = ref<FocusBar[]>([
  { day: 'W1', value: 60, active: false },
  { day: 'W2', value: 75, active: false },
  { day: 'W3', value: 50, active: false },
  { day: 'W4', value: 88, active: true },
  { day: 'W5', value: 40, active: false },
  { day: 'W6', value: 65, active: false },
  { day: 'W7', value: 55, active: false },
])

const focusBars = computed(() =>
  periodMode.value === 'week' ? focusBarsWeek.value : focusBarsMonth.value
)

const projectSlices = ref<ProjectSlice[]>([
  { label: 'Mobile App Dev', pct: 42, color: '#2563eb' },
  { label: 'Brand Identity', pct: 28, color: '#1d4ed8' },
  { label: 'System Audit', pct: 18, color: '#bfdbfe' },
  { label: 'Others', pct: 12, color: '#e5e7eb' },
])

const trendPoints = ref<TrendPoint[]>([
  { week: 'WK 01', value: 55 },
  { week: 'WK 02', value: 30 },
  { week: 'WK 03', value: 70 },
  { week: 'WK 04', value: 45 },
])

const avgSession = ref('52m')
const peakHour = ref('10:00 AM')
const totalTasks = ref(128)
const trendLabel = ref('+12% this month')

// ─── Computed ─────────────────────────────────────────────────────────────

const TREND_W = 340
const TREND_H = 110
const TREND_PAD = 16

const trendPath = computed<string>(() => {
  const pts = trendPoints.value
  if (!pts.length) return ''
  const xStep = (TREND_W - TREND_PAD * 2) / (pts.length - 1)
  const points = pts.map((p, i) => ({
    x: TREND_PAD + i * xStep,
    y: TREND_PAD + ((100 - p.value) / 100) * (TREND_H - TREND_PAD * 2),
  }))
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 2
    const cp1y = points[i - 1].y
    const cp2x = points[i - 1].x + (points[i].x - points[i - 1].x) / 2
    const cp2y = points[i].y
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`
  }
  return d
})

const trendFillPath = computed<string>(() => {
  const pts = trendPoints.value
  if (!pts.length) return ''
  const xStep = (TREND_W - TREND_PAD * 2) / (pts.length - 1)
  const points = pts.map((p, i) => ({
    x: TREND_PAD + i * xStep,
    y: TREND_PAD + ((100 - p.value) / 100) * (TREND_H - TREND_PAD * 2),
  }))
  let d = `M ${points[0].x} ${TREND_H}`
  d += ` L ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 2
    const cp1y = points[i - 1].y
    const cp2x = points[i - 1].x + (points[i].x - points[i - 1].x) / 2
    const cp2y = points[i].y
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`
  }
  d += ` L ${points[points.length - 1].x} ${TREND_H} Z`
  return d
})

const DONUT_R = 70
const DONUT_CX = 100
const DONUT_CY = 100
const CIRC = 2 * Math.PI * DONUT_R

const donutSegments = computed(() => {
  let offset = 0
  return projectSlices.value.map(s => {
    const dash = (s.pct / 100) * CIRC
    const gap = CIRC - dash
    const result = { ...s, strokeDasharray: `${dash} ${gap}`, strokeDashoffset: -offset }
    offset += dash
    return result
  })
})
</script>

<template>
  <div :class="styles['analytics-page']">
    <!-- ── Page Header ───────────────────────────────────────────────────── -->
    <header :class="styles['page-header']">
      <div>
        <h1 :class="styles['page-title']">Productivity Reports</h1>
        <p :class="styles['page-sub']">Detailed breakdown of your deep work and efficiency metrics.</p>
      </div>
    </header>

    <!-- ── Weekly Focus Hours ────────────────────────────────────────────── -->
    <Card :class="styles['focus-card']">
      <div :class="styles['focus-card__header']">
        <div>
          <h2 :class="styles['section-title']">Weekly Focus Hours</h2>
          <p :class="styles['section-sub']">Daily distribution of intensive work sessions</p>
        </div>

        <div :class="styles['period-toggle']">
          <button
            :class="[styles['period-btn'], periodMode === 'week' && styles['period-btn--active']]"
            @click="periodMode = 'week'"
          >
            Week
          </button>
          <button
            :class="[styles['period-btn'], periodMode === 'month' && styles['period-btn--active']]"
            @click="periodMode = 'month'"
          >
            Month
          </button>
        </div>
      </div>

      <div :class="styles['focus-card__body']">
        <div :class="styles['bar-chart']">
          <div
            v-for="bar in focusBars"
            :key="bar.day"
            :class="styles['bar-col']"
          >
            <div :class="styles['bar-track']">
              <div
                :class="[styles['bar-fill'], bar.active && styles['bar-fill--active']]"
                :style="{ height: bar.value + '%' }"
              />
            </div>
            <span :class="styles['bar-label']">{{ bar.day }}</span>
          </div>
        </div>
      </div>
    </Card>

    <!-- ── Bottom Grid ───────────────────────────────────────────────────── -->
    <div :class="styles['bottom-grid']">
      <!-- Tasks by Project -->
      <Card :class="styles['donut-card']">
        <div :class="styles['donut-card__header']">
          <h2 :class="styles['section-title']">Tasks by Project</h2>
        </div>

        <div :class="styles['donut-card__body']">
          <!-- Donut Chart -->
          <div :class="styles['donut-wrap']">
            <svg
              :width="DONUT_CX * 2"
              :height="DONUT_CY * 2"
              :viewBox="`0 0 ${DONUT_CX * 2} ${DONUT_CY * 2}`"
              :class="styles['donut-svg']"
            >
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#2563eb22" />
                </filter>
              </defs>

              <!-- Track -->
              <circle
                :cx="DONUT_CX"
                :cy="DONUT_CY"
                :r="DONUT_R"
                fill="none"
                stroke="#f3f4f6"
                stroke-width="22"
              />

              <!-- Segments -->
              <circle
                v-for="(seg, i) in donutSegments"
                :key="i"
                :cx="DONUT_CX"
                :cy="DONUT_CY"
                :r="DONUT_R"
                fill="none"
                :stroke="seg.color"
                stroke-width="22"
                stroke-linecap="round"
                :stroke-dasharray="seg.strokeDasharray"
                :stroke-dashoffset="seg.strokeDashoffset"
                transform="rotate(-90, 100, 100)"
                filter="url(#shadow)"
                :class="styles['donut-seg']"
              />

              <!-- Center Text -->
              <text
                :x="DONUT_CX"
                :y="DONUT_CY - 8"
                text-anchor="middle"
                :class="styles['donut-center-value']"
              >
                {{ totalTasks }}
              </text>
              <text
                :x="DONUT_CX"
                :y="DONUT_CY + 12"
                text-anchor="middle"
                :class="styles['donut-center-label']"
              >
                TOTAL TASKS
              </text>
            </svg>
          </div>

          <!-- Legend -->
          <ul :class="styles['donut-legend']">
            <li
              v-for="s in projectSlices"
              :key="s.label"
              :class="styles['legend-item']"
            >
              <span :class="styles['legend-dot']" :style="{ background: s.color }" />
              <span :class="styles['legend-label']">{{ s.label }}</span>
              <span :class="styles['legend-pct']">{{ s.pct }}%</span>
            </li>
          </ul>
        </div>
      </Card>

      <!-- Focus Trends -->
      <Card :class="styles['trend-card']">
        <div :class="styles['trend-card__header']">
          <h2 :class="styles['section-title']">Focus Trends</h2>
          <div :class="styles['trend-badge']">
            <TrendingUp :size="12" />
            {{ trendLabel }}
          </div>
        </div>

        <div :class="styles['trend-card__body']">
          <!-- SVG Line Chart -->
          <div :class="styles['trend-chart-wrap']">
            <svg
              :width="TREND_W"
              :height="TREND_H"
              :viewBox="`0 0 ${TREND_W} ${TREND_H}`"
              :class="styles['trend-svg']"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
                </linearGradient>
              </defs>

              <!-- Fill Area -->
              <path :d="trendFillPath" fill="url(#trendGrad)" />

              <!-- Line -->
              <path
                :d="trendPath"
                fill="none"
                stroke="#2563eb"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="styles['trend-line']"
              />

              <!-- Dots -->
              <circle
                v-for="(p, i) in trendPoints"
                :key="i"
                :cx="TREND_PAD + i * ((TREND_W - TREND_PAD * 2) / (trendPoints.length - 1))"
                :cy="TREND_PAD + ((100 - p.value) / 100) * (TREND_H - TREND_PAD * 2)"
                r="4"
                fill="#2563eb"
                stroke="#fff"
                stroke-width="2"
                :class="styles['trend-dot']"
              />
            </svg>

            <!-- Week Labels -->
            <div :class="styles['trend-labels']">
              <span
                v-for="p in trendPoints"
                :key="p.week"
                :class="styles['trend-label']"
              >
                {{ p.week }}
              </span>
            </div>
          </div>

          <!-- Stats Row -->
          <div :class="styles['trend-stats']">
            <div :class="styles['trend-stat']">
              <span :class="styles['trend-stat__label']">AVG. SESSION</span>
              <span :class="styles['trend-stat__value']">{{ avgSession }}</span>
            </div>
            <div :class="styles['trend-stat-divider']" />
            <div :class="styles['trend-stat']">
              <span :class="styles['trend-stat__label']">PEAK HOUR</span>
              <span :class="styles['trend-stat__value']">{{ peakHour }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
