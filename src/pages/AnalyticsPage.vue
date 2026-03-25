<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'
import Card from '@/components/Card/Card.vue'
import PageHeader from '@/components/common/PageHeader.vue'

// ─── Types ────────────────────────────────────────────────────────────────────

type PeriodMode = 'week' | 'month'

interface FocusBar  { 
  day: string; 
  value: number; 
  active: boolean 
}

interface ProjectSlice { 
  label: string; 
  pct: number; 
  color: string 
}

interface TrendPoint { 
  week: string; 
  value: number 
}

// ─── State ────────────────────────────────────────────────────────────────────

const periodMode = ref<PeriodMode>('week')

const focusBarsWeek = ref<FocusBar[]>([
  { day: 'Mon', value: 55, active: false }, 
  { day: 'Tue', value: 82, active: false },
  { day: 'Wed', value: 38, active: false }, 
  { day: 'Thu', value: 90, active: true  },
  { day: 'Fri', value: 72, active: false }, 
  { day: 'Sat', value: 28, active: false },
  { day: 'Sun', value: 45, active: false },
])

const focusBarsMonth = ref<FocusBar[]>([
  { day: 'W1', value: 60, active: false }, 
  { day: 'W2', value: 75, active: false },
  { day: 'W3', value: 50, active: false }, 
  { day: 'W4', value: 88, active: true  },
  { day: 'W5', value: 40, active: false }, 
  { day: 'W6', value: 65, active: false },
  { day: 'W7', value: 55, active: false },
])

const focusBars = computed(() => periodMode.value === 'week' ? focusBarsWeek.value : focusBarsMonth.value)

const projectSlices = ref<ProjectSlice[]>([
  { label: 'Mobile App Dev', pct: 42, color: '#2563eb' },
  { label: 'Brand Identity',  pct: 28, color: '#1d4ed8' },
  { label: 'System Audit',    pct: 18, color: '#bfdbfe' },
  { label: 'Others',          pct: 12, color: '#e5e7eb' },
])

const trendPoints = ref<TrendPoint[]>([
  { week: 'WK 01', value: 55 }, 
  { week: 'WK 02', value: 30 },
  { week: 'WK 03', value: 70 }, 
  { week: 'WK 04', value: 45 },
])

const avgSession = ref('52m')
const peakHour   = ref('10:00 AM')
const totalTasks = ref(128)
const trendLabel = ref('+12% this month')

// ─── SVG Math ─────────────────────────────────────────────────────────────────

const TREND_W = 340; const TREND_H = 110; const TREND_PAD = 16

const trendPath = computed<string>(() => {
  const pts = trendPoints.value; 
  if (!pts.length) 
  return ''

  const xStep = (TREND_W - TREND_PAD * 2) / (pts.length - 1)

  const points = pts.map((p, i) => ({
    x: TREND_PAD + i * xStep,
    y: TREND_PAD + ((100 - p.value) / 100) * (TREND_H - TREND_PAD * 2),
  }))

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i-1].x + (points[i].x - points[i-1].x) / 2
    d += ` C ${cp1x} ${points[i-1].y}, ${cp1x} ${points[i].y}, ${points[i].x} ${points[i].y}`
  }

  return d
})

const trendFillPath = computed<string>(() => {
  const pts = trendPoints.value; 
  if (!pts.length) return ''

  const xStep = (TREND_W - TREND_PAD * 2) / (pts.length - 1)

  const points = pts.map((p, i) => ({
    x: TREND_PAD + i * xStep,
    y: TREND_PAD + ((100 - p.value) / 100) * (TREND_H - TREND_PAD * 2),
  }))

  let d = `M ${points[0].x} ${TREND_H} L ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i-1].x + (points[i].x - points[i-1].x) / 2
    d += ` C ${cp1x} ${points[i-1].y}, ${cp1x} ${points[i].y}, ${points[i].x} ${points[i].y}`
  }
  d += ` L ${points[points.length-1].x} ${TREND_H} Z`

  return d
})

const DONUT_R = 70; 
const DONUT_CX = 100; 
const DONUT_CY = 100
const CIRC = 2 * Math.PI * DONUT_R

const donutSegments = computed(() => {
  let offset = 0
  return projectSlices.value.map(s => {
    const dash = (s.pct / 100) * CIRC
    const result = { 
      ...s, strokeDasharray: `${dash} ${CIRC - dash}`, 
      strokeDashoffset: -offset 
    }
    offset += dash
    
    return result
  })
})
</script>

<template>
  <div class="analytics-page">

    <!-- =========================
         📄 HEADER
    ========================== -->
    <PageHeader
      title="Productivity Reports"
      subtitle="Detailed breakdown of your deep work and efficiency metrics."
    />


    <!-- =========================
         📊 WEEKLY FOCUS
    ========================== -->
    <Card class="focus-card">

      <!-- Header -->
      <div class="focus-card__header">
        <div>
          <h2 class="section-title">Weekly Focus Hours</h2>
          <p class="section-sub">
            Daily distribution of intensive work sessions
          </p>
        </div>

        <div class="period-toggle">
          <button
            class="period-btn"
            :class="{ 'period-btn--active': periodMode === 'week' }"
            @click="periodMode = 'week'"
          >
            Week
          </button>

          <button
            class="period-btn"
            :class="{ 'period-btn--active': periodMode === 'month' }"
            @click="periodMode = 'month'"
          >
            Month
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="focus-card__body">
        <div class="bar-chart">

          <div
            v-for="bar in focusBars"
            :key="bar.day"
            class="bar-col"
          >
            <div class="bar-track">
              <div
                class="bar-fill"
                :class="{ 'bar-fill--active': bar.active }"
                :style="{ height: bar.value + '%' }"
              />
            </div>

            <span class="bar-label">
              {{ bar.day }}
            </span>
          </div>

        </div>
      </div>

    </Card>


    <!-- =========================
         📐 BOTTOM GRID
    ========================== -->
    <div class="bottom-grid">


      <!-- =========================
           🍩 DONUT CARD
      ========================== -->
      <Card class="donut-card">

        <!-- Header -->
        <div class="donut-card__header">
          <h2 class="section-title">Tasks by Project</h2>
        </div>

        <!-- Body -->
        <div class="donut-card__body">

          <!-- Chart -->
          <div class="donut-wrap">
            <svg
              class="donut-svg"
              :width="DONUT_CX * 2"
              :height="DONUT_CY * 2"
              :viewBox="`0 0 ${DONUT_CX * 2} ${DONUT_CY * 2}`"
            >
              <defs>
                <filter id="dshadow">
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="4"
                    flood-color="#2563eb22"
                  />
                </filter>
              </defs>

              <!-- Base circle -->
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
                class="donut-seg"
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
                filter="url(#dshadow)"
              />

              <!-- Center text -->
              <text
                class="donut-value"
                :x="DONUT_CX"
                :y="DONUT_CY - 8"
                text-anchor="middle"
              >
                {{ totalTasks }}
              </text>

              <text
                class="donut-label-text"
                :x="DONUT_CX"
                :y="DONUT_CY + 12"
                text-anchor="middle"
              >
                TOTAL TASKS
              </text>
            </svg>
          </div>

          <!-- Legend -->
          <ul class="donut-legend">
            <li
              v-for="s in projectSlices"
              :key="s.label"
              class="legend-item"
            >
              <span
                class="legend-dot"
                :style="{ background: s.color }"
              />

              <span class="legend-label">
                {{ s.label }}
              </span>

              <span class="legend-pct">
                {{ s.pct }}%
              </span>
            </li>
          </ul>

        </div>
      </Card>


      <!-- =========================
           📈 TREND CARD
      ========================== -->
      <Card class="trend-card">

        <!-- Header -->
        <div class="trend-card__header">
          <h2 class="section-title">Focus Trends</h2>

          <div class="trend-badge">
            <TrendingUp :size="12" />
            {{ trendLabel }}
          </div>
        </div>

        <!-- Body -->
        <div class="trend-card__body">

          <!-- Chart -->
          <div class="trend-chart-wrap">
            <svg
              class="trend-svg"
              :width="TREND_W"
              :height="TREND_H"
              :viewBox="`0 0 ${TREND_W} ${TREND_H}`"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
                </linearGradient>
              </defs>

              <!-- Area -->
              <path :d="trendFillPath" fill="url(#trendGrad)" />

              <!-- Line -->
              <path
                class="trend-line"
                :d="trendPath"
                fill="none"
                stroke="#2563eb"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <!-- Points -->
              <circle
                v-for="(p, i) in trendPoints"
                :key="i"
                class="trend-dot"
                :cx="TREND_PAD + i * ((TREND_W - TREND_PAD * 2) / (trendPoints.length - 1))"
                :cy="TREND_PAD + ((100 - p.value) / 100) * (TREND_H - TREND_PAD * 2)"
                r="4"
                fill="#2563eb"
                stroke="#fff"
                stroke-width="2"
              />
            </svg>

            <!-- Labels -->
            <div class="trend-labels">
              <span
                v-for="p in trendPoints"
                :key="p.week"
                class="trend-label"
              >
                {{ p.week }}
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="trend-stats">
            <div class="trend-stat">
              <span class="trend-stat__label">AVG. SESSION</span>
              <span class="trend-stat__value">{{ avgSession }}</span>
            </div>

            <div class="trend-divider" />

            <div class="trend-stat">
              <span class="trend-stat__label">PEAK HOUR</span>
              <span class="trend-stat__value">{{ peakHour }}</span>
            </div>
          </div>

        </div>
      </Card>

    </div>
  </div>
</template>

<style scoped>

/* =========================
   📄 PAGE
========================= */
.analytics-page {
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


/* =========================
   📝 SECTION
========================= */
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
}

.section-sub {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 2px;
}


/* =========================
   📊 FOCUS CARD
========================= */
.focus-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.focus-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 20px 24px 0;
}

.focus-card__body {
  padding: 16px 24px 24px;
}


/* =========================
   🔘 PERIOD TOGGLE
========================= */
.period-toggle {
  display: flex;

  border: 1px solid #e5e7eb;
  border-radius: 8px;

  overflow: hidden;
  flex-shrink: 0;
}

.period-btn {
  padding: 5px 14px;

  font-size: 0.78rem;
  font-weight: 500;

  color: #6b7280;
  background: #fff;

  border: none;
  cursor: pointer;

  transition: background 0.15s, color 0.15s;
}

.period-btn + .period-btn {
  border-left: 1px solid #e5e7eb;
}

.period-btn--active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}


/* =========================
   📊 BAR CHART
========================= */
.bar-chart {
  display: flex;
  align-items: flex-end;

  gap: 10px;
  height: 160px;

  padding-top: 8px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;
  flex: 1;
}

.bar-track {
  width: 100%;
  height: 130px;

  background: #eff6ff;
  border-radius: 8px 8px 4px 4px;

  display: flex;
  align-items: flex-end;

  overflow: hidden;
}

.bar-fill {
  width: 100%;

  background: #bfdbfe;
  border-radius: 6px 6px 0 0;

  transition: height 0.6s cubic-bezier(0.34,1.56,0.64,1);
}

.bar-fill--active {
  background: #2563eb;
}

.bar-label {
  font-size: 0.7rem;
  font-weight: 600;

  color: #6b7280;
  letter-spacing: 0.03em;
}


/* =========================
   📐 GRID
========================= */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;

  gap: 16px;
  align-items: start;
}


/* =========================
   🍩 DONUT CARD
========================= */
.donut-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.donut-card__header {
  padding: 20px 24px 0;
}

.donut-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;
  padding: 16px 24px 24px;
}

.donut-wrap {
  position: relative;
}

.donut-svg {
  overflow: visible;
}

.donut-seg {
  transition: opacity 0.2s;
}

.donut-seg:hover {
  opacity: 0.8;
}

.donut-value {
  font-size: 28px;
  font-weight: 900;

  fill: #111827;
  font-family: inherit;
  letter-spacing: -0.04em;
}

.donut-label-text {
  font-size: 9px;
  font-weight: 700;

  fill: #6b7280;
  letter-spacing: 0.08em;
  font-family: inherit;
}

.donut-legend {
  list-style: none;

  margin: 0;
  padding: 0;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 9px;
}

.legend-item {
  display: flex;
  align-items: center;

  gap: 8px;
}

.legend-dot {
  width: 10px;
  height: 10px;

  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;

  font-size: 0.8rem;
  font-weight: 500;

  color: #6b7280;
}

.legend-pct {
  font-size: 0.8rem;
  font-weight: 700;

  color: #111827;
}


/* =========================
   📈 TREND CARD
========================= */
.trend-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.trend-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 24px 0;
}

.trend-card__body {
  display: flex;
  flex-direction: column;

  gap: 16px;
  padding: 16px 24px 24px;
}

.trend-badge {
  display: flex;
  align-items: center;

  gap: 4px;

  font-size: 0.72rem;
  font-weight: 600;

  color: #16a34a;
  background: #dcfce7;

  padding: 3px 9px;
  border-radius: 999px;
}

.trend-chart-wrap {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.trend-svg {
  width: 100%;
  height: auto;

  display: block;
}

.trend-line {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;

  animation: drawLine 1s ease forwards 0.2s;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.trend-dot {
  opacity: 0;

  animation: popDot 0.3s ease forwards;
}

.trend-dot:nth-child(3) { animation-delay: 0.4s; }
.trend-dot:nth-child(4) { animation-delay: 0.55s; }
.trend-dot:nth-child(5) { animation-delay: 0.7s; }
.trend-dot:nth-child(6) { animation-delay: 0.85s; }

@keyframes popDot {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.trend-labels {
  display: flex;
  justify-content: space-between;

  padding: 0 4px;
}

.trend-label {
  font-size: 0.65rem;
  font-weight: 600;

  color: #6b7280;
  letter-spacing: 0.04em;
}

.trend-stats {
  display: flex;
  align-items: center;

  gap: 20px;

  background: #f9fafb;
  border-radius: 12px;

  padding: 14px 20px;
}

.trend-stat {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.trend-stat__label {
  font-size: 0.6rem;
  font-weight: 700;

  letter-spacing: 0.08em;
  color: #6b7280;
}

.trend-stat__value {
  font-size: 1.3rem;
  font-weight: 800;

  color: #111827;
  letter-spacing: -0.03em;
}

.trend-divider {
  width: 1px;
  height: 36px;

  background: #e5e7eb;
}


/* =========================
   📱 RESPONSIVE
========================= */
@media (max-width: 720px) {
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

</style>