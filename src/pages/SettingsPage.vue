<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button/Button.vue'
import Input from '@/components/Input/Input.vue'
import Card from '@/components/Card/Card.vue'
import styles from './SettingsPage.module.scss'

const settings = ref({
  fullName: 'Alex Johnson',
  email: 'alex@example.com',
  timezone: 'America/New_York',
  theme: 'light',
  notifications: true,
  emailDigest: false,
})

const isDirty = ref(false)

function handleSave() {
  console.log('Settings saved:', settings.value)
  isDirty.value = false
}

function handleReset() {
  settings.value = {
    fullName: 'Alex Johnson',
    email: 'alex@example.com',
    timezone: 'America/New_York',
    theme: 'light',
    notifications: true,
    emailDigest: false,
  }
  isDirty.value = false
}
</script>

<template>
  <div :class="styles['settings-container']">
    <div :class="styles['settings-header']">
      <h1 :class="styles['settings-title']">Preferences</h1>
      <p :class="styles['settings-subtitle']">Customize your FocusFlow experience</p>
    </div>

    <!-- Profile Section -->
    <Card :class="styles['settings-card']">
      <div :class="styles['settings-section']">
        <h2 :class="styles['settings-section__title']">Profile Settings</h2>

        <div :class="styles['form-group']">
          <label :class="styles['form-label']">Full Name</label>
          <Input
            v-model="settings.fullName"
            type="text"
            placeholder="Your name"
            @input="isDirty = true"
          />
        </div>

        <div :class="styles['form-group']">
          <label :class="styles['form-label']">Email Address</label>
          <Input
            v-model="settings.email"
            type="email"
            placeholder="your@email.com"
            @input="isDirty = true"
          />
        </div>

        <div :class="styles['form-group']">
          <label :class="styles['form-label']">Timezone</label>
          <select
            v-model="settings.timezone"
            :class="styles['form-select']"
            @change="isDirty = true"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Asia/Singapore">Singapore</option>
          </select>
        </div>

        <div :class="styles['form-actions']">
          <Button
            @click="handleSave"
            :class="styles['btn-primary']"
          >
            Save Changes
          </Button>
          <button
            @click="handleReset"
            :class="styles['btn-secondary']"
          >
            Reset
          </button>
        </div>
      </div>
    </Card>

    <!-- Preferences Section -->
    <Card :class="styles['settings-card']">
      <div :class="styles['settings-section']">
        <h2 :class="styles['settings-section__title']">Notifications</h2>

        <div :class="styles['preference-item']">
          <div :class="styles['preference-text']">
            <p :class="styles['preference-label']">Push Notifications</p>
            <p :class="styles['preference-desc']">Receive real-time notifications for tasks and reminders</p>
          </div>
          <input
            v-model="settings.notifications"
            type="checkbox"
            :class="styles['form-checkbox']"
            @change="isDirty = true"
          />
        </div>

        <div :class="styles['preference-divider']"></div>

        <div :class="styles['preference-item']">
          <div :class="styles['preference-text']">
            <p :class="styles['preference-label']">Email Digests</p>
            <p :class="styles['preference-desc']">Receive weekly summary of your productivity</p>
          </div>
          <input
            v-model="settings.emailDigest"
            type="checkbox"
            :class="styles['form-checkbox']"
            @change="isDirty = true"
          />
        </div>
      </div>
    </Card>

    <!-- Appearance Section -->
    <Card :class="styles['settings-card']">
      <div :class="styles['settings-section']">
        <h2 :class="styles['settings-section__title']">Appearance</h2>

        <div :class="styles['preference-item']">
          <div :class="styles['preference-text']">
            <p :class="styles['preference-label']">Theme</p>
            <p :class="styles['preference-desc']">Choose your preferred color scheme</p>
          </div>
          <select
            v-model="settings.theme"
            :class="styles['form-select-inline']"
            @change="isDirty = true"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </Card>
  </div>
</template>
