// @ts-nocheck
// Frontend Composable Example

import { ref, computed, watch } from 'vue';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types/models';
import { useTaskStore } from '@/stores/modules/taskStore.example';

export function useTask() {
  const store = useTaskStore();
  
  // Local State
  const isModalOpen = ref(false);
  const editingTask = ref<Task | null>(null);
  const searchQuery = ref('');
  const filterPriority = ref<'all' | 'low' | 'medium' | 'high'>('all');

  // Computed
  const filteredTasks = computed(() => {
    let result = store.tasks;

    // Filter by search query
    if (searchQuery.value) {
      result = result.filter((task: Task) =>
        task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    // Filter by priority
    if (filterPriority.value !== 'all') {
      result = result.filter((task: Task) => task.priority === filterPriority.value);
    }

    return result;
  });

  const progressPercentage = computed(() => {
    if (store.totalTasks === 0) return 0;
    return Math.round((store.completedTasks.length / store.totalTasks) * 100);
  });

  // Methods
  const openModal = (task?: Task): void => {
    editingTask.value = task || null;
    isModalOpen.value = true;
  };

  const closeModal = (): void => {
    isModalOpen.value = false;
    editingTask.value = null;
  };

  const saveTask = async (data: CreateTaskDTO | UpdateTaskDTO): Promise<void> => {
    if (editingTask.value) {
      await store.updateTask(editingTask.value.id, data as UpdateTaskDTO);
    } else {
      await store.createTask(data as CreateTaskDTO);
    }
    closeModal();
  };

  const removeTask = async (id: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this task?')) {
      await store.deleteTask(id);
    }
  };

  const toggleTaskCompletion = async (task: Task): Promise<void> => {
    await store.toggleTask(task.id);
  };

  // Watchers
  watch(
    () => searchQuery.value,
    () => {
      // Reset to first page if pagination exists
    }
  );

  // Initialize
  store.fetchTasks();

  return {
    // State
    filteredTasks,
    isModalOpen,
    editingTask,
    searchQuery,
    filterPriority,
    
    // Computed
    progressPercentage,
    tasks: computed(() => store.tasks),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    
    // Methods
    openModal,
    closeModal,
    saveTask,
    removeTask,
    toggleTaskCompletion
  };
}
