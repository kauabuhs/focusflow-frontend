<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
    User, 
    SlidersHorizontal, 
    Bell, 
    Check, 
    Camera 
} from 'lucide-vue-next'

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsTab = 'profile' | 'preferences' | 'notifications'

interface Profile {
  fullName: string; 
  email: string; 
  role: string; 
  location: string; 
  avatarUrl: string | null
}
interface Preferences {
  focusDuration: number; 
  darkMode: boolean; 
  soundNotifications: boolean
}
interface NotificationSettings {
  sessionReminders: boolean; 
  weeklyReport: boolean; 
  milestoneAlerts: boolean; 
  teamUpdates: boolean
}

// ─── State ────────────────────────────────────────────────────────────────────

const activeTab = ref<SettingsTab>('profile')

const profile = reactive<Profile>({
  fullName: 'Alex Thompson', email: 'alex.t@focusflow.app',
  role: 'Product Designer based in Berlin', location: 'Berlin, Germany', avatarUrl: null,
})

const preferences = reactive<Preferences>({ 
    focusDuration: 45, 
    darkMode: false, 
    soundNotifications: true 
})

const notifications = reactive<NotificationSettings>({
  sessionReminders: true, 
  weeklyReport: true, 
  milestoneAlerts: false, 
  teamUpdates: true,
})

const saved       = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)

// ─── Methods ──────────────────────────────────────────────────────────────────

function setTab(tab: SettingsTab): void { activeTab.value = tab }

function handleAvatarUpload(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { profile.avatarUrl = ev.target?.result as string }
  reader.readAsDataURL(file)
}

function triggerAvatarInput(): void { avatarInput.value?.click() }

function saveChanges(): void { saved.value = true; setTimeout(() => (saved.value = false), 2000) }

function discardChanges(): void { /* reset to snapshot if needed */ }

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div class="settings-page">

    <header class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-sub">Manage your account settings and set your focus preferences.</p>
    </header>

    <div class="settings-layout">

      <!-- Sidebar Nav -->
      <nav class="settings-nav">
        <button 
        class="settings-nav__item" 
        :class="{ 'settings-nav__item--active'
        : activeTab === 'profile' }" 
        @click="setTab('profile')"
        >

          <User :size="16" /> <span>Profile</span>
        </button>

        <button 
        class="settings-nav__item" 
        :class="{ 'settings-nav__item--active'
        : activeTab === 'preferences' }" 
        @click="setTab('preferences')"
        >

          <SlidersHorizontal :size="16" /> <span>Preferences</span>
        </button>

        <button 
        class="settings-nav__item" 
        :class="{ 'settings-nav__item--active'
        : activeTab === 'notifications' }" 
        @click="setTab('notifications')"
        >

          <Bell :size="16" /> <span>Notifications</span>
        </button>

      </nav>

      <!-- Content -->
      <div class="settings-content">

        <!-- Profile Tab -->
        <template v-if="activeTab === 'profile'">
          <section class="settings-section">
            <h2 class="settings-section__title">PROFILE INFORMATION</h2>
            <div class="settings-card">

              <div class="avatar-row">
                <div class="avatar-wrap" @click="triggerAvatarInput">
                  <img 
                  v-if="profile.avatarUrl" 
                  :src="profile.avatarUrl" 
                  :alt="profile.fullName" 
                  class="avatar-img" 
                  />

                  <div v-else class="avatar-placeholder">{{ initials(profile.fullName) }}</div>
                  <div class="avatar-overlay"><Camera :size="14" /></div>
                </div>

                <input 
                ref="avatarInput" 
                type="file" 
                accept="image/*" 
                class="avatar-input" 
                @change="handleAvatarUpload" 
                />

                <div class="avatar-info">
                  <span class="avatar-info__name">{{ profile.fullName }}</span>
                  <span class="avatar-info__role">{{ profile.role }}</span>
                </div>

              </div>

              <div class="fields-grid">
                <div class="field-group">
                  <label class="field-label">Full Name</label>
                  <input 
                  v-model="profile.fullName" 
                  type="text" class="field-input" placeholder="Your full name" />
                </div>
                <div class="field-group">
                  <label class="field-label">Email Address</label>
                  <input 
                  v-model="profile.email" 
                  type="email" class="field-input" placeholder="your@email.com" />
                </div>
                <div class="field-group">
                  <label class="field-label">Role / Title</label>
                  <input 
                  v-model="profile.role" 
                  type="text" class="field-input" placeholder="e.g. Product Designer" />
                </div>
                <div class="field-group">
                  <label class="field-label">Location</label>
                  <input v-model="profile.location" type="text" class="field-input" placeholder="City, Country" />
                </div>
              </div>

            </div>
          </section>
        </template>

        <!-- Preferences Tab -->
        <template v-if="activeTab === 'preferences'">
          <section class="settings-section">
            <h2 class="settings-section__title">SYSTEM PREFERENCES</h2>
            <div class="settings-card settings-card--gap">

              <div class="pref-row pref-row--column">
                <div class="pref-row__header">
                  <div>
                    <p class="pref-row__label">Focus Session Duration</p>
                    <p class="pref-row__sub">Default time for each deep work block</p>
                  </div>
                  <span class="pref-row__value">{{ preferences.focusDuration }} min</span>
                </div>
                <div class="slider-wrap">
                  <span class="slider-edge">25 MIN</span>
                  <input v-model.number="preferences.focusDuration" type="range" min="25" max="90" step="5" class="slider" />
                  <span class="slider-edge">90 MIN</span>
                </div>
              </div>

              <div class="pref-divider" />

              <div class="pref-row">
                <div>
                  <p class="pref-row__label">Dark Mode</p>
                  <p class="pref-row__sub">Adjust the interface to reduce eye strain</p>
                </div>

                <button class="toggle" 
                :class="{ 'toggle--on': preferences.darkMode }" 
                :aria-pressed="preferences.darkMode" 
                @click="preferences.darkMode = !preferences.darkMode"
                >

                  <span class="toggle__thumb" />
                </button>
              </div>

              <div class="pref-divider" />

              <div class="pref-row">
                <div>
                  <p class="pref-row__label">Sound Notifications</p>
                  <p class="pref-row__sub">Play a subtle tone when a session completes</p>
                </div>

                <button class="toggle" 
                :class="{ 'toggle--on': preferences.soundNotifications }" 
                :aria-pressed="preferences.soundNotifications" 
                @click="preferences.soundNotifications = !preferences.soundNotifications"
                >
                  <span class="toggle__thumb" />
                </button>
              </div>

            </div>
          </section>
        </template>

        <!-- Notifications Tab -->
        <template v-if="activeTab === 'notifications'">
          <section class="settings-section">
            <h2 class="settings-section__title">NOTIFICATION PREFERENCES</h2>
            <div class="settings-card settings-card--gap">

              <div class="pref-row">
                <div><p class="pref-row__label">Session Reminders</p><p class="pref-row__sub">Remind me to start my next focus block</p></div>
                <button class="toggle" 
                :class="{ 'toggle--on': notifications.sessionReminders }" 
                :aria-pressed="notifications.sessionReminders"
                @click="notifications.sessionReminders = !notifications.sessionReminders">
                  <span class="toggle__thumb" />
                </button>
              </div>
              <div class="pref-divider" />
              <div class="pref-row">
                <div><p class="pref-row__label">Weekly Report</p><p class="pref-row__sub">Receive a summary of your productivity each week</p></div>
                <button class="toggle" 
                :class="{ 'toggle--on': notifications.weeklyReport }" 
                :aria-pressed="notifications.weeklyReport"
                @click="notifications.weeklyReport = !notifications.weeklyReport"
                >
                  <span class="toggle__thumb" />
                </button>
              </div>
              <div class="pref-divider" />
              <div class="pref-row">
                <div><p class="pref-row__label">Milestone Alerts</p><p class="pref-row__sub">Get notified when a project milestone is reached</p></div>
                <button class="toggle" 
                :class="{ 'toggle--on': notifications.milestoneAlerts }" 
                :aria-pressed="notifications.milestoneAlerts"
                @click="notifications.milestoneAlerts = !notifications.milestoneAlerts"
                >
                  <span class="toggle__thumb" />
                </button>
              </div>
              <div class="pref-divider" />
              <div class="pref-row">
                <div><p class="pref-row__label">Team Updates</p><p class="pref-row__sub">Notify when a team member completes a task</p></div>
                <button class="toggle" 
                :class="{ 'toggle--on': notifications.teamUpdates }" 
                :aria-pressed="notifications.teamUpdates"
                @click="notifications.teamUpdates = !notifications.teamUpdates"
                >
                  <span class="toggle__thumb" />
                </button>
              </div>

            </div>
          </section>
        </template>

      </div>
    </div>

    <!-- Footer -->
    <footer class="settings-footer">
      <button class="btn-discard" @click="discardChanges">Discard Changes</button>
      <button class="btn-save" :class="{ 'btn-save--saved': saved }" @click="saveChanges">
        <Check v-if="saved" :size="15" class="btn-save__icon" />
        {{ saved ? 'Saved!' : 'Save Changes' }}
      </button>
    </footer>

  </div>
</template>

<style scoped>
.settings-page {
  display: flex; 
  flex-direction: column; 
  gap: 24px;
  max-width: 860px; margin: 0 auto;
  animation: fadeUp 0.35s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-title { 
    font-size: 1.6rem; 
    font-weight: 800; 
    color: #111827; 
    letter-spacing: -0.03em; 
}

.page-sub   { 
    font-size: 0.85rem; 
    color: #6b7280; 
    margin-top: 3px; 
}

/* Layout */
.settings-layout { 
    display: grid; 
    grid-template-columns: 180px 1fr; 
    gap: 20px; 
    align-items: start; 
}

/* Sidebar */
.settings-nav { 
    display: flex; 
    flex-direction: column; 
    gap: 2px; 
    background: #fff; 
    border: 1px solid #e5e7eb; 
    border-radius: 12px; 
    padding: 8px; 
}

.settings-nav__item {
  display: flex; 
  align-items: center; 
  gap: 9px; 
  padding: 10px 12px;
  border-radius: 8px; 
  border: none; 
  background: transparent; 
  cursor: pointer;
  font-size: 0.875rem; 
  font-weight: 500; 
  color: #6b7280;
  width: 100%; 
  text-align: left; 
  transition: background 0.15s, color 0.15s; 
  font-family: inherit;
}
.settings-nav__item:hover { 
    background: #f9fafb; 
    color: #111827; 
}

.settings-nav__item--active { 
    background: #eff6ff; 
    color: #2563eb; 
    font-weight: 600; 
}

.settings-content { 
    display: flex; 
    flex-direction: column; 
    gap: 24px; 
}

.settings-section__title { 
    font-size: 0.62rem; 
    font-weight: 700; 
    letter-spacing: 0.1em; 
    color: #6b7280; 
    margin-bottom: 12px; 
}

.settings-card { 
    background: #fff; 
    border: 1px solid #e5e7eb; 
    border-radius: 12px; 
    padding: 24px; 
}
.settings-card--gap { 
    display: flex; 
    flex-direction: column; 
}

/* Avatar */
.avatar-row { 
    display: flex; 
    align-items: center; 
    gap: 16px; 
    padding-bottom: 24px; 
    border-bottom: 1px solid #e5e7eb;
     margin-bottom: 24px; 
    }

.avatar-wrap { 
    position: relative; 
    width: 64px; 
    height: 64px; 
    border-radius: 50%; 
    cursor: pointer; 
    flex-shrink: 0; 
}

.avatar-img, .avatar-placeholder { 
    width: 64px; 
    height: 64px; 
    border-radius: 50%; 
    object-fit: cover; 
}

.avatar-placeholder { 
    background: #2563eb; 
    color: #fff; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 1.1rem; 
    font-weight: 700; 
}

.avatar-overlay { 
    position: absolute; 
    inset: 0; 
    border-radius: 50%; 
    background: rgba(0,0,0,0.35); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #fff; 
    opacity: 0; 
    transition: opacity 0.2s; 
}

.avatar-wrap:hover .avatar-overlay { opacity: 1; }

.avatar-wrap::after {
  content: '✓'; 
  position: absolute; 
  bottom: 1px; 
  right: 1px;
  width: 18px; 
  height: 18px; 
  border-radius: 50%;
  background: #2563eb; 
  color: #fff; 
  font-size: 0.6rem; 
  font-weight: 900;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border: 2px solid #fff;
}

.avatar-input { display: none; }
.avatar-info { 
    display: flex; 
    flex-direction: column; 
    gap: 3px; 
}

.avatar-info__name { 
    font-size: 1rem; 
    font-weight: 700; 
    color: #111827; 
}

.avatar-info__role { 
    font-size: 0.8rem; 
    color: #6b7280; 
}

/* Fields */
.fields-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 16px; 
}
.field-group { 
    display: flex; 
    flex-direction: column;
    gap: 6px; 
}

.field-label { 
    font-size: 0.72rem; 
    font-weight: 600; 
    color: #6b7280; 
    letter-spacing: 0.02em; 
}

.field-input {
  padding: 9px 12px; 
  border: 1px solid #e5e7eb; 
  border-radius: 8px;
  font-size: 0.875rem; 
  color: #111827; 
  background: #f9fafb; 
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; 
  font-family: inherit;
}

.field-input:focus { 
    border-color: #2563eb; 
    background: #fff; 
    box-shadow: 0 0 0 3px #2563eb14; 
}

.field-input::placeholder { color: #d1d5db; }

/* Pref Row */
.pref-row { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    gap: 20px; 
    padding: 18px 0; 
}

.pref-row--column { 
    flex-direction: column; 
    align-items: stretch; 
    gap: 14px; 
}

.pref-row__header { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
}

.pref-row__label  { 
    font-size: 0.9rem; 
    font-weight: 600; 
    color: #111827; 
}

.pref-row__sub    { 
    font-size: 0.78rem; 
    color: #6b7280; 
    margin-top: 2px; 
}

.pref-row__value  { 
    font-size: 0.9rem; 
    font-weight: 700; 
    color: #2563eb; 
    white-space: nowrap; 
}

.pref-divider { 
    height: 1px; 
    background: #e5e7eb; 
}

/* Slider */
.slider-wrap  { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
}

.slider-edge  { 
    font-size: 0.62rem; 
    font-weight: 700; 
    color: #6b7280; 
    letter-spacing: 0.04em; 
    white-space: nowrap; 
}

.slider { 
    flex: 1; 
    -webkit-appearance: none; 
    appearance: none; 
    height: 4px; 
    border-radius: 999px; 
    background: #e5e7eb; 
    outline: none; 
    cursor: pointer; 
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none; 
  width: 18px; 
  height: 18px; 
  border-radius: 50%;
  background: #2563eb; 
  border: 3px solid #fff; 
  box-shadow: 0 1px 6px rgba(37,99,235,0.4);
  cursor: pointer; 
  transition: transform 0.15s;
}

.slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
.slider::-moz-range-thumb { 
    width: 18px; 
    height: 18px; 
    border-radius: 50%; 
    background: #2563eb; 
    border: 3px solid #fff; 
    cursor: pointer; 
}

/* Toggle */
.toggle {
  position: relative; 
  width: 44px; 
  height: 24px; 
  border-radius: 999px;
  border: none; 
  background: #d1d5db; 
  cursor: pointer; 
  flex-shrink: 0;
  transition: background 0.2s; 
  padding: 0;
}
.toggle--on { background: #2563eb; }
.toggle__thumb {
  position: absolute; 
  top: 3px; 
  left: 3px; 
  width: 18px; 
  height: 18px;
  border-radius: 50%; 
  background: #fff; 
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); 
  display: block;
}
.toggle--on .toggle__thumb { transform: translateX(20px); }

/* Footer */
.settings-footer { 
    display: flex; 
    align-items: center; 
    justify-content: flex-end;
    gap: 10px; 
    padding-top: 4px; 
}

.btn-discard {
  padding: 9px 20px; 
  border: 1px solid #e5e7eb; 
  border-radius: 9px; 
  background: #fff;
  font-size: 0.875rem; 
  font-weight: 500; 
  color: #6b7280; 
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s; 
  font-family: inherit;
}

.btn-discard:hover { 
    border-color: #9ca3af; 
    color: #111827; 
}

.btn-save {
  display: flex; 
  align-items: center; 
  gap: 6px; 
  padding: 9px 22px; 
  border: none;
  border-radius: 9px; 
  background: #2563eb; 
  font-size: 0.875rem; 
  font-weight: 600;
  color: #fff; 
  cursor: pointer; 
  transition: opacity 0.15s, background 0.2s; 
  font-family: inherit;
}

.btn-save:hover { opacity: 0.88; }
.btn-save--saved { background: #16a34a; }
.btn-save__icon  { flex-shrink: 0; }

/* Responsive */
@media (max-width: 680px) {
  .settings-layout { grid-template-columns: 1fr; }
  .fields-grid     { grid-template-columns: 1fr; }

  .settings-nav    { 
    flex-direction: row; 
    flex-wrap: wrap; 
}
}

</style>
