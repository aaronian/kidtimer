import { useState } from 'react';
import type { Task } from './types';
import { loadTasks, saveTasks, updateBestTime } from './storage';
import TaskPicker from './components/TaskPicker';
import Timer from './components/Timer';
import Result from './components/Result';

type View = 'picker' | 'timer' | 'result';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [view, setView] = useState<View>('picker');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  function handleSelectTask(task: Task) {
    setActiveTask(task);
    setView('timer');
  }

  function handleStop(time: number) {
    if (!activeTask) return;
    const rounded = Math.round(time * 10) / 10;
    const newRecord = activeTask.bestTime === null || rounded < activeTask.bestTime;
    const updatedTasks = updateBestTime(tasks, activeTask.id, rounded);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    // Update activeTask to reflect new best time for Result display
    setActiveTask(updatedTasks.find(t => t.id === activeTask.id) ?? activeTask);
    setElapsed(rounded);
    setIsNewRecord(newRecord);
    setView('result');
  }

  function handleResultDone() {
    setView('picker');
  }

  if (view === 'timer' && activeTask) {
    return <Timer task={activeTask} onStop={handleStop} />;
  }

  if (view === 'result' && activeTask) {
    return (
      <Result
        task={activeTask}
        elapsed={elapsed}
        isNewRecord={isNewRecord}
        onDone={handleResultDone}
      />
    );
  }

  return (
    <TaskPicker
      tasks={tasks}
      onTasksChange={tasks => { setTasks(tasks); saveTasks(tasks); }}
      onSelect={handleSelectTask}
    />
  );
}
