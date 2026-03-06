import { useState } from 'react';
import type { Task } from '../types';
import { saveTasks } from '../storage';

interface Props {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onSelect: (task: Task) => void;
}

export default function TaskPicker({ tasks, onTasksChange, onSelect }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  function handleAdd() {
    if (!newName.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: '⭐',
      bestTime: null,
    };
    const updated = [...tasks, newTask];
    onTasksChange(updated);
    saveTasks(updated);
    setNewName('');
    setAdding(false);
  }

  function formatBest(seconds: number | null): string {
    if (seconds === null) return 'No record yet';
    if (seconds < 60) return `Best: ${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `Best: ${m}m ${s}s`;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⏱️ KidTimer</h1>
      <p style={styles.subtitle}>What are we doing?</p>

      <div style={styles.grid}>
        {tasks.map(task => (
          <button
            key={task.id}
            style={styles.card}
            onClick={() => onSelect(task)}
          >
            <span style={styles.emoji}>{task.emoji}</span>
            <span style={styles.taskName}>{task.name}</span>
            <span style={styles.best}>{formatBest(task.bestTime)}</span>
          </button>
        ))}

        {adding ? (
          <div style={styles.addForm}>
            <input
              autoFocus
              style={styles.input}
              placeholder="Task name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <div style={styles.addButtons}>
              <button style={styles.confirmBtn} onClick={handleAdd}>Add</button>
              <button style={styles.cancelBtn} onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button style={styles.addCard} onClick={() => setAdding(true)}>
            <span style={{ fontSize: 36 }}>＋</span>
            <span style={styles.taskName}>Add Task</span>
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    backgroundColor: '#f0fdf4',
    padding: '24px 16px',
    overflowY: 'auto',
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    textAlign: 'center',
    color: '#166534',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4ade80',
    fontWeight: 600,
    marginBottom: 24,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    maxWidth: 480,
    margin: '0 auto',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: '3px solid #bbf7d0',
    borderRadius: 20,
    padding: '20px 12px',
    cursor: 'pointer',
    gap: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  emoji: { fontSize: 44 },
  taskName: { fontSize: 16, fontWeight: 700, color: '#166534' },
  best: { fontSize: 12, color: '#86efac', fontWeight: 500 },
  addCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    border: '3px dashed #86efac',
    borderRadius: 20,
    padding: '20px 12px',
    cursor: 'pointer',
    gap: 6,
    color: '#4ade80',
  },
  addForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#fff',
    border: '3px solid #86efac',
    borderRadius: 20,
    padding: 16,
  },
  input: {
    fontSize: 16,
    padding: '8px 12px',
    borderRadius: 10,
    border: '2px solid #bbf7d0',
    outline: 'none',
  },
  addButtons: { display: 'flex', gap: 8 },
  confirmBtn: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#4ade80',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
};
