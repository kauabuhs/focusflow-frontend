// Frontend Types

// Domain Model
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Domain Model
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// DTO - Request
export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// DTO - Request
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
