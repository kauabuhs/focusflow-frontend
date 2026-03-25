<script setup lang="ts">
import { ref } from 'vue'
import {
  Plus,
  RefreshCw,
  Server,
  TrendingUp,
  Smartphone,
  ShieldCheck,
  Rocket,
  Users,
  ChevronRight,
} from 'lucide-vue-next'
import Button from '@/components/Button/Button.vue'
import Card from '@/components/Card/Card.vue'
import Badge from '@/components/Badge/Badge.vue'
import styles from './ProjectsPage.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────

type BadgeColor = 'blue' | 'red' | 'green' | 'amber' | 'violet' | 'slate'

interface Contributor {
  initials: string
  color: string
}

interface Project {
  id: string
  icon: ReturnType<typeof Rocket>
  iconBg: string
  iconColor: string
  badge: string
  badgeColor: BadgeColor
  name: string
  description: string
  progress: number
  progressColor: string
  tasksCompleted: number
  tasksTotal: number
  contributors: Contributor[]
  extraContributors: number
}

// ─── Data ─────────────────────────────────────────────────────────────────

const projects = ref<Project[]>([
  {
    id: '1',
    icon: RefreshCw,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    badge: 'HIGH PRIORITY',
    badgeColor: 'red',
    name: 'Astra Rebrand 2024',
    description: 'Redesigning the core visual identity and design system for the enterprise...',
    progress: 60,
    progressColor: '#2563eb',
    tasksCompleted: 8,
    tasksTotal: 12,
    contributors: [
      { initials: 'AR', color: '#2563eb' },
      { initials: 'MB', color: '#7c3aed' },
    ],
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
    description: 'Moving legacy infrastructure to serverless nodes for improved latenc...',
    progress: 25,
    progressColor: '#2563eb',
    tasksCompleted: 4,
    tasksTotal: 16,
    contributors: [
      { initials: 'JD', color: '#0d9488' },
    ],
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
    description: 'Campaign focus on customer acquisition via social channels and...',
    progress: 90,
    progressColor: '#dc2626',
    tasksCompleted: 16,
    tasksTotal: 20,
    contributors: [
      { initials: 'SR', color: '#dc2626' },
      { initials: 'KL', color: '#d97706' },
      { initials: 'PW', color: '#7c3aed' },
    ],
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
    description: 'Adding dark mode support and native calendar integration for iOS a...',
    progress: 45,
    progressColor: '#2563eb',
    tasksCompleted: 5,
    tasksTotal: 11,
    contributors: [
      { initials: 'AR', color: '#2563eb' },
    ],
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
    description: 'Final audit preparations and documentation for security standard...',
    progress: 12,
    progressColor: '#6b7280',
    tasksCompleted: 2,
    tasksTotal: 19,
    contributors: [
      { initials: 'EC', color: '#475569' },
    ],
    extraContributors: 0,
  },
])

const roadmapProgress = ref(72)
const activeContributors = ref(24)

// ─── Methods ───────────────────────────────────────────────────────────────

const badgeClasses: Record<BadgeColor, string> = {
  red: 'project-badge--red',
  blue: 'project-badge--blue',
  amber: 'project-badge--amber',
  green: 'project-badge--green',
  violet: 'project-badge--blue',
  slate: 'project-badge--slate',
}

function getBadgeClass(color: BadgeColor): string {
  return styles[badgeClasses[color]] || ''
}
</script>

<template>
  <div :class="styles['projects-page']">
    <!-- ── Page Header ──────────────────────────────────────────────────── -->
    <header :class="styles['page-header']">
      <div>
        <h1 :class="styles['page-title']">Projects</h1>
        <p :class="styles['page-sub']">Organize your workflow and track milestones across your team.</p>
      </div>

      <Button :class="styles['create-btn']">
        <Plus :size="15" />
        Create Project
      </Button>
    </header>

    <!-- ── Project Grid ──────────────────────────────────────────────────── -->
    <div :class="styles['project-grid']">
      <!-- Project Cards -->
      <Card
        v-for="project in projects"
        :key="project.id"
        :class="styles['project-card']"
      >
        <div :class="styles['project-card__body']">
          <!-- Top Row -->
          <div :class="styles['project-card__top']">
            <div
              :class="styles['project-card__icon']"
              :style="{ background: project.iconBg }"
            >
              <component
                :is="project.icon"
                :size="18"
                :style="{ color: project.iconColor }"
              />
            </div>

            <Badge :class="getBadgeClass(project.badgeColor)">
              {{ project.badge }}
            </Badge>
          </div>

          <!-- Name & Description -->
          <h3 :class="styles['project-card__name']">{{ project.name }}</h3>
          <p :class="styles['project-card__desc']">{{ project.description }}</p>

          <!-- Progress -->
          <div :class="styles['project-card__progress']">
            <div :class="styles['progress-label']">
              <span :class="styles['progress-label__text']">Progress</span>
              <span :class="styles['progress-label__pct']">{{ project.progress }}%</span>
            </div>
            <div :class="styles['progress-track']">
              <div
                :class="styles['progress-track__fill']"
                :style="{
                  width: project.progress + '%',
                  background: project.progressColor,
                }"
              />
            </div>
          </div>

          <!-- Footer -->
          <div :class="styles['project-card__footer']">
            <div :class="styles['task-count']">
              <span :class="styles['task-count__icon']">⊙</span>
              <span :class="styles['task-count__text']">
                {{ project.tasksCompleted }}/{{ project.tasksTotal }} Tasks
              </span>
            </div>

            <div :class="styles['contributor-stack']">
              <div
                v-for="(c, i) in project.contributors"
                :key="i"
                :class="styles['contributor-avatar']"
                :style="{ background: c.color, zIndex: project.contributors.length - i }"
                :title="c.initials"
              >
                {{ c.initials }}
              </div>
              <div
                v-if="project.extraContributors > 0"
                :class="[styles['contributor-avatar'], styles['contributor-avatar--extra']]"
              >
                +{{ project.extraContributors }}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Add New Project Card -->
      <Card :class="styles['add-project-card']">
        <div :class="styles['add-project-card__body']">
          <button :class="styles['add-project-card__btn']">
            <Plus :size="20" />
          </button>
          <p :class="styles['add-project-card__label']">Add new project</p>
          <p :class="styles['add-project-card__hint']">Start from a template or blank</p>
        </div>
      </Card>
    </div>

    <!-- ── Bottom Row ───────────────────────────────────────────────────── -->
    <div :class="styles['bottom-row']">
      <!-- Quarterly Roadmap -->
      <Card :class="styles['roadmap-card']">
        <div :class="styles['roadmap-card__body']">
          <div :class="styles['roadmap-card__info']">
            <h3 :class="styles['roadmap-card__title']">Quarterly Roadmap</h3>
            <p :class="styles['roadmap-card__sub']">
              You are {{ roadmapProgress }}% through your Q1 goals. Keep the momentum!
            </p>
            <Button :class="styles['roadmap-card__btn']">
              View Roadmap
              <ChevronRight :size="14" />
            </Button>
          </div>

          <div :class="styles['roadmap-card__rocket']">
            <Rocket :size="64" />
          </div>
        </div>
      </Card>

      <!-- Active Contributors -->
      <Card :class="styles['stat-card']">
        <div :class="styles['stat-card__body']">
          <div :class="[styles['stat-card__icon-wrap'], styles['stat-card__icon-wrap--blue']]">
            <Users :size="22" :class="styles['stat-card__icon']" />
          </div>
          <h3 :class="styles['stat-card__title']">Active Contributors</h3>
          <p :class="styles['stat-card__value']">{{ activeContributors }}</p>
          <p :class="styles['stat-card__sub']">Across all projects</p>
        </div>
      </Card>
    </div>
  </div>
</template>
