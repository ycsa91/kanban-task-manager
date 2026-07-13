import api from './api';
import type Task from '../types/task';

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  create: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  update: async (id: number, task: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};