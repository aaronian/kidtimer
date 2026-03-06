export interface Task {
  id: string;
  name: string;
  emoji: string;
  bestTime: number | null; // seconds, null = no record yet
}
