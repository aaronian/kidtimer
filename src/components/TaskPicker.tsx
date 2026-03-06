import { useState, useRef } from 'react';
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
  const [pressedTaskId, setPressedTaskId] = useState<string | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  function startPress(taskId: string) {
    didLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setPressedTaskId(taskId);
    }, 600);
  }

  function cancelPress() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  function handleClearBest(task: Task) {
    if (!confirm(`Clear best time for ${task.name}?`)) return;
    const updated = tasks.map(t => t.id === task.id ? { ...t, bestTime: null } : t);
    onTasksChange(updated);
    setPressedTaskId(null);
  }

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
        {tasks.map(task => {
          const isPressed = pressedTaskId === task.id;
          return (
            <div
              key={task.id}
              style={{ ...styles.card, position: 'relative', overflow: 'hidden', userSelect: 'none' }}
              onMouseDown={() => startPress(task.id)}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={() => startPress(task.id)}
              onTouchEnd={cancelPress}
              onClick={() => {
                if (didLongPress.current) { didLongPress.current = false; return; }
                if (pressedTaskId) { setPressedTaskId(null); return; }
                onSelect(task);
              }}
            >
              <span style={styles.emoji}>{task.emoji}</span>
              <span style={styles.taskName}>{task.name}</span>
              <span style={styles.best}>{formatBest(task.bestTime)}</span>

              {isPressed && (
                <div style={styles.overlay}>
                  {task.bestTime !== null && (
                    <button
                      style={styles.clearBtn}
                      onClick={e => { e.stopPropagation(); handleClearBest(task); }}
                    >
                      🗑️ Clear record
                    </button>
                  )}
                  <button
                    style={styles.cancelOverlayBtn}
                    onClick={e => { e.stopPropagation(); setPressedTaskId(null); }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}

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
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 17,
  },
  clearBtn: {
    padding: '10px 16px',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    width: '80%',
  },
  cancelOverlayBtn: {
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    width: '80%',
  },
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
