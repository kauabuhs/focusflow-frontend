// @ts-nocheck
// Frontend Store Example (Pinia)

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types/models';
import { TaskService } from '@/services/api/taskService.example';

export const useTaskStore = defineStore('task', () => {
  // State
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedTask = ref<Task | null>(null);

  // Getters
  const completedTasks = computed(() => 
    tasks.value.filter((task: Task) => task.completed)
  );

  const pendingTasks = computed(() => 
    tasks.value.filter((task: Task) => !task.completed)
  );

  const totalTasks = computed(() => tasks.value.length);

  const tasksByPriority = computed(() => ({
    high: tasks.value.filter((t: Task) => t.priority === 'high'),
    medium: tasks.value.filter((t: Task) => t.priority === 'medium'),
    low: tasks.value.filter((t: Task) => t.priority === 'low')
  }));

  // Actions
  const fetchTasks = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      tasks.value = await TaskService.getTasks();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks';
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (payload: CreateTaskDTO): Promise<Task | null> => {
    loading.value = true;
    error.value = null;

    try {
      const newTask = await TaskService.createTask(payload);
      tasks.value.unshift(newTask);
      return newTask;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (id: string, payload: UpdateTaskDTO): Promise<Task | null> => {
    loading.value = true;
    error.value = null;

    try {
      const updatedTask = await TaskService.updateTask(id, payload);
      const index = tasks.value.findIndex((t: Task) => t.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
      return updatedTask;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await TaskService.deleteTask(id);
      tasks.value = tasks.value.filter((t: Task) => t.id !== id);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const toggleTask = async (id: string): Promise<Task | null> => {
    const task = tasks.value.find((t: Task) => t.id === id);
    if (!task) return null;

    return updateTask(id, { completed: !task.completed });
  };

  const selectTask = (task: Task | null): void => {
    selectedTask.value = task;
  };

  return {
    // State
    tasks,
    loading,
    error,
    selectedTask,
    
    // Getters
    completedTasks,
    pendingTasks,
    totalTasks,
    tasksByPriority,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    selectTask
  };
});
