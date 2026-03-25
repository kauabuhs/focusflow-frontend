<script setup lang="ts">
import { ref } from 'vue'
import {
  Plus, RefreshCw, Server, TrendingUp, Smartphone,
  ShieldCheck, Rocket, Users, AlertTriangle, ChevronRight,
} from 'lucide-vue-next'
import Card from '@/components/Card/Card.vue'
import PageHeader from '@/components/common/PageHeader.vue'

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeColor = 'blue' | 'red' | 'green' | 'amber' | 'violet' | 'slate'

interface Contributor { initials: string; color: string }

interface Project {
  id: string
  icon: ReturnType<typeof Rocket>
  iconBg: string; 
  iconColor: string
  badge: string; 
  badgeColor: BadgeColor
  name: string; 
  description: string
  progress: number; 
  progressColor: string
  tasksCompleted: number; 
  tasksTotal: number
  contributors: Contributor[]
  extraContributors: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects = ref<Project[]>([
  {
    id: '1', 
    icon: RefreshCw, 
    iconBg: '#eff6ff', 
    iconColor: '#2563eb',
    badge: 'HIGH PRIORITY', 
    badgeColor: 'red',
    name: 'Astra Rebrand 2024',
    description: 'Redesigning the core visual identity and design system for the enterprise platform.',
    progress: 60, 
    progressColor: '#2563eb',
    tasksCompleted: 8, 
    tasksTotal: 12,
    contributors: [{ 
      initials: 'AR', 
      color: '#2563eb' 
    }, 

    { initials: 'MB', 
      color: '#7c3aed' 
    }],

    extraContributors: 5,
  },
  {
    id: '2', 
    icon: Server, 
    iconBg: '#f0fdf4', 
    iconColor: '#16a34a',
    badge: 'INTERNAL', 
    badgeColor: 'slate',
    name: 'Backend Migration',
    description: 'Moving legacy infrastructure to serverless nodes for improved latency and scale.',
    progress: 25, 
    progressColor: '#2563eb',
    tasksCompleted: 4, 
    tasksTotal: 16,
    contributors: [{ 
      initials: 'JD', 
      color: '#0d9488' 
    }],

    extraContributors: 1,
  },
  {
    id: '3', 
    icon: TrendingUp, 
    iconBg: '#fef3c7', 
    iconColor: '#d97706',
    badge: 'MARKETING', 
    badgeColor: 'amber',
    name: 'Q3 Growth Sprint',
    description: 'Campaign focus on customer acquisition via social channels and partnerships.',
    progress: 90, 
    progressColor: '#dc2626',
    tasksCompleted: 16, 
    tasksTotal: 20,
    contributors: [{ 
      initials: 'SR', 
      color: '#dc2626' 
    },

    { initials: 'KL', 
      color: '#d97706' 
    },

    { initials: 'PW', 
    color: '#7c3aed' 
  }],

    extraContributors: 0,
  },
  {
    id: '4', 
    icon: Smartphone, 
    iconBg: '#eff6ff', 
    iconColor: '#2563eb',
    badge: 'MOBILE APP', 
    badgeColor: 'blue',
    name: 'Mobile App V2.1',
    description: 'Adding dark mode support and native calendar integration for iOS and Android.',
    progress: 45, 
    progressColor: '#2563eb',
    tasksCompleted: 5, 
    tasksTotal: 11,
    contributors: [{ initials: 'AR', color: '#2563eb' }],
    extraContributors: 2,
  },
  {
    id: '5', 
    icon: ShieldCheck, 
    iconBg: '#f0fdf4', 
    iconColor: '#16a34a',
    badge: 'SECURITY', 
    badgeColor: 'green',
    name: 'SOC2 Compliance',
    description: 'Final audit preparations and documentation for security standard certification.',
    progress: 12, 
    progressColor: '#6b7280',
    tasksCompleted: 2, 
    tasksTotal: 19,
    contributors: [{ initials: 'EC', color: '#475569' }],
    extraContributors: 0,
  },
])

const roadmapProgress    = ref(72)
const activeContributors = ref(24)
const overdueMilestones  = ref(3)

function badgeClass(color: BadgeColor): string {
  return { 
    red: 'badge--red', 
    blue: 'badge--blue', 
    green: 'badge--green', 
    amber: 'badge--amber', 
    violet: 'badge--violet', 
    slate: 'badge--slate' 
  }[color]
}
</script>

<template>
  <div class="projects-page">

    <!-- ───────────────────────────────
         HEADER
    ─────────────────────────────── -->
    <PageHeader
      title="Projects"
      subtitle="Organize your workflow and track milestones across your team."
    >
      <template #actions>
        <button class="create-btn">
          <Plus :size="15" />
          Create Project
        </button>
      </template>
    </PageHeader>


    <!-- ───────────────────────────────
         PROJECT GRID
    ─────────────────────────────── -->
    <div class="project-grid">

      <!-- ─── Project Card ─── -->
      <Card
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-card__body">

          <!-- Header -->
          <div class="project-card__top">
            <div
              class="project-card__icon"
              :style="{ background: project.iconBg }"
            >
              <component
                :is="project.icon"
                :size="18"
                :style="{ color: project.iconColor }"
              />
            </div>

            <span
              class="project-badge"
              :class="badgeClass(project.badgeColor)"
            >
              {{ project.badge }}
            </span>
          </div>

          <!-- Content -->
          <h3 class="project-card__name">
            {{ project.name }}
          </h3>

          <p class="project-card__desc">
            {{ project.description }}
          </p>

          <!-- Progress -->
          <div class="project-card__progress">
            <div class="progress-label">
              <span class="progress-label__text">Progress</span>
              <span class="progress-label__pct">
                {{ project.progress }}%
              </span>
            </div>

            <div class="progress-track">
              <div
                class="progress-track__fill"
                :style="{
                  width: project.progress + '%',
                  background: project.progressColor
                }"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="project-card__footer">

            <!-- Tasks -->
            <div class="task-count">
              <span class="task-count__dot">⊙</span>
              <span>
                {{ project.tasksCompleted }}/{{ project.tasksTotal }} Tasks
              </span>
            </div>

            <!-- Contributors -->
            <div class="contributor-stack">
              <div
                v-for="(c, i) in project.contributors"
                :key="i"
                class="contributor-avatar"
                :style="{
                  background: c.color,
                  zIndex: project.contributors.length - i
                }"
                :title="c.initials"
              >
                {{ c.initials }}
              </div>

              <div
                v-if="project.extraContributors > 0"
                class="contributor-avatar contributor-avatar--extra"
              >
                +{{ project.extraContributors }}
              </div>
            </div>

          </div>
        </div>
      </Card>


      <!-- ─── Add Project Card ─── -->
      <Card class="add-project-card">
        <div class="add-project-card__body">

          <button class="add-project-card__btn">
            <Plus :size="20" />
          </button>

          <p class="add-project-card__label">
            Add new project
          </p>

          <p class="add-project-card__hint">
            Start from a template or blank
          </p>

        </div>
      </Card>

    </div>


    <!-- ───────────────────────────────
         BOTTOM SECTION
    ─────────────────────────────── -->
    <div class="bottom-row">

      <!-- ─── Roadmap Card ─── -->
      <Card class="roadmap-card">
        <div class="roadmap-card__body">

          <div class="roadmap-card__info">
            <h3 class="roadmap-card__title">
              Quarterly Roadmap
            </h3>

            <p class="roadmap-card__sub">
              You are {{ roadmapProgress }}% through your Q1 goals. Keep the momentum!
            </p>

            <button class="roadmap-card__btn">
              View Roadmap
              <ChevronRight :size="14" />
            </button>
          </div>

          <div class="roadmap-card__rocket">
            <Rocket :size="72" />
          </div>

        </div>
      </Card>


      <!-- ─── Stat Card: Contributors ─── -->
      <Card class="stat-card">
        <div class="stat-card__body">

          <div class="stat-card__icon-wrap stat-card__icon-wrap--blue">
            <Users :size="22" />
          </div>

          <span class="stat-card__value">
            {{ activeContributors }}
          </span>

          <span class="stat-card__label">
            Active Contributors
          </span>

        </div>
      </Card>


      <!-- ─── Stat Card: Overdue ─── -->
      <Card class="stat-card stat-card--warn">
        <div class="stat-card__body">

          <div class="stat-card__icon-wrap stat-card__icon-wrap--red">
            <AlertTriangle :size="22" class="icon--red" />
          </div>

          <span class="stat-card__value stat-card__value--red">
            {{ overdueMilestones }}
          </span>

          <span class="stat-card__label">
            Overdue Milestones
          </span>

        </div>
      </Card>

    </div>

  </div>
</template>

<style scoped>

/* ──────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────── */

.projects-page {
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


/* ──────────────────────────────────────────────────────────────
   ACTIONS
────────────────────────────────────────────────────────────── */

.create-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  background: #2563eb;
  color: #fff;

  border: none;
  border-radius: 10px;

  font-size: 0.875rem;
  font-weight: 600;

  padding: 0 18px;
  height: 38px;

  cursor: pointer;

  transition: opacity 0.15s;
}

.create-btn:hover {
  opacity: 0.88;
}


/* ──────────────────────────────────────────────────────────────
   GRID
────────────────────────────────────────────────────────────── */

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}


/* ──────────────────────────────────────────────────────────────
   PROJECT CARD
────────────────────────────────────────────────────────────── */

.project-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;

  cursor: pointer;

  transition: box-shadow 0.2s, transform 0.2s;
}

.project-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.project-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 20px;
}


/* ─── Header ─── */

.project-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-card__icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  flex-shrink: 0;
}


/* ─── Badge ─── */

.project-badge {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.07em;

  padding: 3px 8px;
  border-radius: 999px;
}

.badge--red    { background: #fee2e2; color: #dc2626; }
.badge--blue   { background: #eff6ff; color: #2563eb; }
.badge--green  { background: #dcfce7; color: #16a34a; }
.badge--amber  { background: #fef3c7; color: #d97706; }
.badge--violet { background: #f5f3ff; color: #7c3aed; }
.badge--slate  { background: #f1f5f9; color: #475569; }


/* ─── Content ─── */

.project-card__name {
  font-size: 0.975rem;
  font-weight: 700;

  color: #111827;

  letter-spacing: -0.01em;
  line-height: 1.3;
}

.project-card__desc {
  font-size: 0.78rem;
  color: #6b7280;

  line-height: 1.5;

  display: -webkit-box;
  -line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


/* ─── Progress ─── */

.project-card__progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-label__text {
  font-size: 0.72rem;
  font-weight: 500;

  color: #6b7280;
}

.progress-label__pct {
  font-size: 0.72rem;
  font-weight: 700;

  color: #111827;
}

.progress-track {
  width: 100%;
  height: 5px;

  background: #e5e7eb;

  border-radius: 999px;
  overflow: hidden;
}

.progress-track__fill {
  height: 100%;

  border-radius: 999px;

  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}


/* ─── Footer ─── */

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 4px;
}

.task-count {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-count__dot {
  font-size: 0.8rem;
  color: #6b7280;
}

.task-count span:last-child {
  font-size: 0.75rem;
  font-weight: 500;

  color: #6b7280;
}


/* ─── Contributors ─── */

.contributor-stack {
  display: flex;
  align-items: center;
}

.contributor-avatar {
  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 2px solid #fff;

  font-size: 0.55rem;
  font-weight: 700;
  color: #fff;

  margin-left: -6px;
  position: relative;

  transition: transform 0.15s;
}

.contributor-avatar:first-child {
  margin-left: 0;
}

.contributor-avatar:hover {
  transform: translateY(-2px);
}

.contributor-avatar--extra {
  background: #e5e7eb;
  color: #6b7280;
}


/* ──────────────────────────────────────────────────────────────
   ADD PROJECT CARD
────────────────────────────────────────────────────────────── */

.add-project-card {
  border: 2px dashed #e5e7eb;
  border-radius: 14px;

  background: transparent;

  cursor: pointer;

  transition: border-color 0.2s;
}

.add-project-card:hover {
  border-color: #2563eb;
}

.add-project-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 200px;
  padding: 20px;
}

.add-project-card__btn {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 2px dashed #e5e7eb;

  background: transparent;
  color: #6b7280;

  cursor: pointer;

  transition: border-color 0.15s, color 0.15s;
}

.add-project-card:hover .add-project-card__btn {
  border-color: #2563eb;
  color: #2563eb;
}

.add-project-card__label {
  font-size: 0.875rem;
  font-weight: 600;

  color: #111827;
}

.add-project-card__hint {
  font-size: 0.75rem;
  color: #6b7280;
}


/* ──────────────────────────────────────────────────────────────
   BOTTOM ROW
────────────────────────────────────────────────────────────── */

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 160px 160px;
  gap: 16px;

  align-items: stretch;
}


/* ─── Roadmap ─── */

.roadmap-card {
  background: #1d4ed8;
  border: none;
  border-radius: 16px;

  overflow: hidden;
}

.roadmap-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 100%;
  padding: 28px 32px;
}

.roadmap-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.roadmap-card__title {
  font-size: 1.25rem;
  font-weight: 800;

  color: #fff;

  letter-spacing: -0.02em;
}

.roadmap-card__sub {
  font-size: 0.82rem;
  color: #bfdbfe;

  line-height: 1.5;
  max-width: 280px;
}

.roadmap-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  background: #fff;
  color: #1d4ed8;

  border: none;
  border-radius: 8px;

  font-size: 0.8rem;
  font-weight: 600;

  padding: 8px 16px;

  cursor: pointer;

  width: fit-content;
  margin-top: 4px;

  transition: opacity 0.15s;
}

.roadmap-card__btn:hover {
  opacity: 0.9;
}

.roadmap-card__rocket {
  opacity: 0.18;
  transform: rotate(-20deg);

  flex-shrink: 0;
  color: #fff;
}


/* ─── Stats ─── */

.stat-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;

  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.stat-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  text-align: center;
  height: 100%;

  padding: 24px 20px;
}

.stat-card__icon-wrap {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
}

.stat-card__icon-wrap--blue {
  background: #eff6ff;
  color: #2563eb;
}

.stat-card__icon-wrap--red {
  background: #fee2e2;
  color: #dc2626;
}

.icon--red {
  color: #dc2626;
}

.stat-card__value {
  font-size: 2.2rem;
  font-weight: 900;

  color: #111827;

  letter-spacing: -0.04em;
  line-height: 1;
}

.stat-card__value--red {
  color: #dc2626;
}

.stat-card__label {
  font-size: 0.78rem;
  font-weight: 500;

  color: #6b7280;
  text-align: center;
}


/* ──────────────────────────────────────────────────────────────
   RESPONSIVE
────────────────────────────────────────────────────────────── */

@media (max-width: 900px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bottom-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}

</style>