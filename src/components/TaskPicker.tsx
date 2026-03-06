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
  const [editing, setEditing] = useState(false);

  function handleClearBest(task: Task) {
    if (!confirm(`Clear best time for ${task.name}?`)) return;
    const updated = tasks.map(t => t.id === task.id ? { ...t, bestTime: null } : t);
    onTasksChange(updated);
  }

  function handleDeleteTask(task: Task) {
    if (!confirm(`Delete "${task.name}"?`)) return;
    onTasksChange(tasks.filter(t => t.id !== task.id));
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
      <div style={styles.header}>
        <h1 style={styles.title}>⏱️ KidTimer</h1>
        <button
          style={editing ? styles.doneBtn : styles.editBtn}
          onClick={() => { setEditing(e => !e); setAdding(false); }}
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>
      <p style={styles.subtitle}>{editing ? 'Tap a card to manage it' : 'What are we doing?'}</p>

      <div style={styles.grid}>
        {tasks.map(task => (
          <div
            key={task.id}
            style={{ ...styles.card, cursor: editing ? 'default' : 'pointer', position: 'relative' }}
            onClick={() => { if (!editing) onSelect(task); }}
          >
            {/* Delete badge — top-right corner in edit mode */}
            {editing && (
              <button
                style={styles.deleteBadge}
                onClick={e => { e.stopPropagation(); handleDeleteTask(task); }}
              >
                ✕
              </button>
            )}

            <span style={styles.emoji}>{task.emoji}</span>
            <span style={styles.taskName}>{task.name}</span>
            <span style={styles.best}>{formatBest(task.bestTime)}</span>

            {/* Clear record button — shown in edit mode when a record exists */}
            {editing && task.bestTime !== null && (
              <button
                style={styles.clearRecordBtn}
                onClick={e => { e.stopPropagation(); handleClearBest(task); }}
              >
                Clear record
              </button>
            )}
          </div>
        ))}

        {!editing && (adding ? (
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
        ))}
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    textAlign: 'center',
    color: '#166534',
    margin: 0,
  },
  editBtn: {
    position: 'absolute',
    right: 0,
    padding: '6px 14px',
    fontSize: 15,
    fontWeight: 700,
    color: '#166534',
    backgroundColor: 'transparent',
    border: '2px solid #bbf7d0',
    borderRadius: 10,
    cursor: 'pointer',
  },
  doneBtn: {
    position: 'absolute',
    right: 0,
    padding: '6px 14px',
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    backgroundColor: '#4ade80',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
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
    gap: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  emoji: { fontSize: 44 },
  taskName: { fontSize: 16, fontWeight: 700, color: '#166534' },
  best: { fontSize: 12, color: '#86efac', fontWeight: 500 },
  deleteBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontWeight: 900,
    fontSize: 13,
    border: '2px solid #fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  clearRecordBtn: {
    marginTop: 4,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 700,
    color: '#ef4444',
    backgroundColor: '#fee2e2',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
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
