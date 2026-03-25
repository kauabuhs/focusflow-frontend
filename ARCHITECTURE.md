# 🎨 Arquitetura Frontend - FocusFlow

## Visão Geral

Frontend estruturado em **arquitetura modular** com separação de concerns, composables (Composition API) e state management centralized (Pinia).

## Estrutura de Pastas

### `/components` - Componentes Reutilizáveis
Componentes Vue.js organizados por tipo e contexto.

```
components/
├── common/           # Componentes genéricos (Button, Input, Modal)
└── features/         # Componentes específicas de features
```

**Exemplo:**
```
components/
├── common/
│   ├── Button.vue
│   ├── Input.vue
│   ├── Card.vue
│   └── Modal.vue
├── features/
│   ├── TaskForm.vue
│   ├── TaskList.vue
│   └── TaskCard.vue
```

---

### `/pages` - Páginas/Views
Páginas principais da aplicação, organizadas por feature/domínio.

```
pages/
├── auth/
│   ├── LoginPage.vue
│   └── RegisterPage.vue
├── dashboard/
│   ├── DashboardPage.vue
│   └── AnalyticsPage.vue
└── tasks/
    ├── TasksPage.vue
    └── TaskDetailPage.vue
```

**Responsabilidades:**
- Renderizar layout da página
- Orquestrar composables e componentes
- Gerenciar estado local da página

---

### `/composables` - Vue Composables
Lógica reutilizável usando Composition API.

```
composables/
├── useTask.ts          # Lógica de tarefas
├── useAuth.ts          # Lógica de autenticação
├── useFetch.ts         # Requisições genéricas
└── useForm.ts          # Gerenciar formulários
```

**Responsabilidades:**
- Lógica reutilizável
- Hooks customizados
- Gerenciamento de estado local
- Side effects (watchers, lifecycle)

**Exemplo:**
```typescript
// composables/useTask.ts
export function useTask() {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  
  const fetchTasks = async () => {
    loading.value = true;
    tasks.value = await taskService.getTasks();
  };
  
  const createTask = async (data: CreateTaskDTO) => {
    return await taskService.create(data);
  };
  
  return { tasks, loading, fetchTasks, createTask };
}
```

---

### `/stores` - State Management (Pinia)
Gerenciamento de estado global da aplicação.

```
stores/
├── modules/
│   ├── taskStore.ts    # Estado de tarefas
│   ├── authStore.ts    # Estado de autenticação
│   ├── uiStore.ts      # Estado de UI
│   └── projectStore.ts
└── index.ts            # Exporta todas as stores
```

**Estrutura:**
```typescript
// stores/modules/taskStore.ts
export const useTaskStore = defineStore('task', () => {
  // State
  const tasks = ref<Task[]>([]);
  
  // Getters
  const completedTasks = computed(() => 
    tasks.value.filter(t => t.completed)
  );
  
  // Actions
  const fetchTasks = async () => {
    tasks.value = await taskService.getTasks();
  };
  
  return { tasks, completedTasks, fetchTasks };
});
```

---

### `/services` - Integração com API
Serviços para comunicação com backend.

```
services/
├── api/
│   ├── taskApi.ts      # Task API calls
│   ├── authApi.ts      # Auth API calls
│   └── projectApi.ts
└── http/
    └── axiosInstance.ts  # Configuração HTTP client
```

**Exemplo:**
```typescript
// services/api/taskApi.ts
export class TaskApiService {
  async getTasks(): Promise<Task[]> {
    return httpClient.get('/tasks');
  }
  
  async createTask(data: CreateTaskDTO): Promise<Task> {
    return httpClient.post('/tasks', data);
  }
  
  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    return httpClient.put(`/tasks/${id}`, data);
  }
}
```

---

### `/types` - TypeScript Types & Interfaces
Tipos e interfaces compartilhadas.

```
types/
├── models/           # Modelos de domínio
│   ├── Task.ts
│   ├── User.ts
│   └── Project.ts
└── dto/              # Data Transfer Objects
    ├── CreateTaskDTO.ts
    ├── UpdateTaskDTO.ts
    └── ResponseDTO.ts
```

**Exemplo:**
```typescript
// types/models/Task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

// types/dto/CreateTaskDTO.ts
export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}
```

---

### `/utils` - Funções Auxiliares
Utilidades e helpers genéricos.

```
utils/
├── helpers/          # Funções auxiliares
│   ├── dateFormatter.ts
│   ├── stringUtils.ts
│   └── arrayUtils.ts
└── validators/       # Validação de dados
    ├── taskValidator.ts
    └── formValidator.ts
```

---

### `/constants` - Constantes Globais
Enums e constantes da aplicação.

```
constants/
└── enums/
    ├── TaskStatus.ts
    ├── Priority.ts
    └── AppRoutes.ts
```

**Exemplo:**
```typescript
// constants/enums/TaskStatus.ts
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

---

### `/layouts` - Layouts da Aplicação
Layouts compartilhados entre páginas.

```
layouts/
├── MainLayout.vue    # Layout padrão (header + sidebar)
├── AuthLayout.vue    # Layout de autenticação
└── EmptyLayout.vue   # Sem navegação
```

---

### `/styles` - Estilos Globais
CSS/SCSS compartilhado.

```
styles/
├── variables/
│   ├── colors.css
│   ├── spacing.css
│   └── typography.css
├── global.css
├── reset.css
└── utilities.css
```

---

### `/router` - Roteamento
Configuração de rotas e guards.

```
router/
├── index.ts          # Configuração principal
└── guards/
    ├── authGuard.ts
    └── roleGuard.ts
```

**Exemplo:**
```typescript
// router/index.ts
const routes = [
  {
    path: '/login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/tasks',
    component: () => import('@/pages/tasks/TasksPage.vue'),
    beforeEnter: authGuard,
    meta: { requiresAuth: true }
  }
];

// router/guards/authGuard.ts
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    next();
  } else {
    next('/login');
  }
};
```

---

### `/plugins` - Plugins Vue
Extensões e configurações globais.

```
plugins/
├── vuetify.ts        # UI Framework (Vuetify)
├── axios.ts          # HTTP Client
└── pinia.ts          # State Management
```

---

## Fluxo de Dados

```
User Interaction (Click)
        ↓
Component Event Handler
        ↓
Composable / Store Action
        ↓
API Service Call
        ↓
Backend Response
        ↓
Store Update / Composable State Update
        ↓
Component Re-render
        ↓
UI Updated
```

---

## Padrões Utilizados

### 1. Composition API Pattern
```typescript
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTask } from '@/composables/useTask';

const { tasks, loading, fetchTasks, createTask } = useTask();

const completedCount = computed(() => 
  tasks.value.filter(t => t.completed).length
);

onMounted(() => fetchTasks());
</script>
```

### 2. Store Pattern (Pinia)
```typescript
const taskStore = useTaskStore();
taskStore.fetchTasks();
taskStore.createTask(newTask);
```

### 3. Service Pattern
```typescript
const taskService = new TaskApiService();
const tasks = await taskService.getTasks();
```

---

## Convenções

### Nomes de Arquivos
- **Componentes**: `TaskCard.vue` (PascalCase)
- **Páginas**: `TasksPage.vue` (FeatureName + Page)
- **Composables**: `useTask.ts` (use + FeatureName)
- **Stores**: `taskStore.ts` (featureName + Store)
- **Services**: `taskApi.ts` (featureName + Api)
- **Types**: `Task.ts` (Singular, PascalCase)
- **DTOs**: `CreateTaskDTO.ts` (Verbo + Nome + DTO)

### Component Scoped Styles
```vue
<style scoped lang="scss">
.task-card {
  padding: 1rem;
  
  &__title {
    font-size: 1.25rem;
  }
  
  &__actions {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
```

---

## Dependências entre Camadas

```
Pages → Composables / Components → Services ← API
     ↓                ↓                ↓
   Stores → Types, Utils, Constants ← Backend
```

---

## Próximos Passos

1. Criar componentes em `/components`
2. Criar páginas em `/pages`
3. Implementar composables em `/composables`
4. Configurar stores em `/stores`
5. Criar services em `/services`
6. Definir tipos em `/types`
7. Configurar router em `/router`

