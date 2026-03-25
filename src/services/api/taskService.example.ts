// @ts-nocheck
// Frontend API Service Example

import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    const { data } = await httpClient.get<Task[]>('/tasks');
    return data;
  }

  static async getTaskById(id: string): Promise<Task> {
    const { data } = await httpClient.get<Task>(`/tasks/${id}`);
    return data;
  }

  static async createTask(payload: CreateTaskDTO): Promise<Task> {
    const { data } = await httpClient.post<Task>('/tasks', payload);
    return data;
  }

  static async updateTask(id: string, payload: UpdateTaskDTO): Promise<Task> {
    const { data } = await httpClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  }

  static async deleteTask(id: string): Promise<void> {
    await httpClient.delete(`/tasks/${id}`);
  }

  static async toggleTaskCompletion(id: string): Promise<Task> {
    const { data } = await httpClient.patch<Task>(`/tasks/${id}/toggle`, {});
    return data;
  }
}

export default httpClient;
