import { useEffect, useRef, useState } from 'react';
import type { Task } from '../types';

interface Props {
  task: Task;
  onStop: (elapsed: number) => void;
}

// Returns a color based on how close we are to the best time.
// No record = always green. Getting close = yellow → red.
function getBackgroundColor(elapsed: number, best: number | null): string {
  if (best === null) return '#4ade80'; // green, no pressure
  const ratio = elapsed / best;
  if (ratio < 0.7) return '#4ade80';   // green
  if (ratio < 0.9) return '#facc15';   // yellow
  if (ratio < 1.0) return '#fb923c';   // orange
  return '#f87171';                     // red — over best time
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds * 10) % 10);
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}.${tenths}`;
  return `${s}.${tenths}`;
}

export default function Timer({ task, onStop }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(Date.now());
  const frameRef = useRef<number>(0);

  useEffect(() => {
    function tick() {
      setElapsed((Date.now() - startRef.current) / 1000);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const bgColor = getBackgroundColor(elapsed, task.bestTime);

  return (
    <div style={{ ...styles.container, backgroundColor: bgColor }}>
      <div style={styles.taskLabel}>
        <span style={styles.taskEmoji}>{task.emoji}</span>
        <span style={styles.taskName}>{task.name}</span>
      </div>

      <div style={styles.timeDisplay}>{formatTime(elapsed)}</div>

      {task.bestTime !== null && (
        <div style={styles.bestLabel}>
          Best: {formatTime(task.bestTime)}
        </div>
      )}

      <button style={styles.stopButton} onClick={() => onStop(elapsed)}>
        STOP!
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    transition: 'background-color 0.5s ease',
    padding: 24,
  },
  taskLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  taskEmoji: { fontSize: 56 },
  taskName: { fontSize: 24, fontWeight: 800, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.2)' },
  timeDisplay: {
    fontSize: 96,
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 2px 12px rgba(0,0,0,0.15)',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  },
  bestLabel: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 600,
  },
  stopButton: {
    marginTop: 16,
    padding: '24px 64px',
    fontSize: 32,
    fontWeight: 900,
    backgroundColor: '#fff',
    color: '#166534',
    border: 'none',
    borderRadius: 24,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    letterSpacing: 1,
  },
};
