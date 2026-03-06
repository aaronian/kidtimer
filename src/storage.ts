import type { Task } from './types';

const STORAGE_KEY = 'kidtimer_tasks';

const DEFAULT_TASKS: Task[] = [
  { id: 'pajamas', name: 'Pajamas', emoji: '🩲', bestTime: null },
  { id: 'dressed', name: 'Get Dressed', emoji: '👕', bestTime: null },
  { id: 'teeth', name: 'Brush Teeth', emoji: '🪥', bestTime: null },
  { id: 'shoes', name: 'Shoes', emoji: '👟', bestTime: null },
];

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function updateBestTime(tasks: Task[], taskId: string, time: number): Task[] {
  return tasks.map(t =>
    t.id === taskId && (t.bestTime === null || time < t.bestTime)
      ? { ...t, bestTime: time }
      : t
  );
}
