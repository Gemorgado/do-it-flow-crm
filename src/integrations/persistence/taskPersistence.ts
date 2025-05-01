
import { Task } from "@/types";
import { store, saveToStorage } from "./store";

export const taskPersistence = {
  listTasks: async (): Promise<Task[]> => {
    return Promise.resolve([...store.tasks]);
  },

  getTask: async (id: string): Promise<Task | undefined> => {
    return Promise.resolve(store.tasks.find(task => task.id === id));
  },

  createTask: async (task: Task): Promise<Task> => {
    store.tasks.push(task);
    saveToStorage();
    return Promise.resolve(task);
  },

  updateTask: async (task: Task): Promise<Task> => {
    const index = store.tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      store.tasks[index] = task;
      saveToStorage();
      return Promise.resolve(task);
    }
    throw new Error(`Tarefa com ID ${task.id} não encontrada`);
  },

  deleteTask: async (id: string): Promise<void> => {
    store.tasks = store.tasks.filter(task => task.id !== id);
    saveToStorage();
    return Promise.resolve();
  }
};
