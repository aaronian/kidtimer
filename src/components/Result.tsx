import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Task } from '../types';

interface Props {
  task: Task;
  elapsed: number;
  isNewRecord: boolean;
  onDone: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds * 10) % 10);
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}.${tenths}`;
  return `${s}.${tenths}`;
}

export default function Result({ task, elapsed, isNewRecord, onDone }: Props) {
  useEffect(() => {
    if (isNewRecord) {
      // Big confetti burst for a new record
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#4ade80', '#facc15', '#fb923c', '#f87171', '#818cf8'],
      });
      setTimeout(() => confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      }), 400);
    } else {
      // Small celebration burst just for finishing — good job!
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#60a5fa', '#f472b6', '#a78bfa'],
      });
    }
  }, [isNewRecord]);

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: isNewRecord ? '#4ade80' : '#f0fdf4',
      }}
      onClick={onDone}
    >
      {isNewRecord ? (
        <>
          <div style={styles.trophy}>🏆</div>
          <div style={styles.recordText}>NEW RECORD!</div>
          <div style={styles.timeText}>{formatTime(elapsed)}</div>
          <div style={styles.taskInfo}>{task.emoji} {task.name}</div>
          <div style={styles.tapHint}>Tap anywhere to continue</div>
        </>
      ) : (
        <>
          <div style={styles.trophy}>💪</div>
          <div style={styles.goodJobText}>Great job!</div>
          <div style={styles.timeText}>{formatTime(elapsed)}</div>
          {task.bestTime !== null && (
            <div style={styles.bestInfo}>
              Best is still {formatTime(task.bestTime)}
            </div>
          )}
          <div style={styles.taskInfo}>{task.emoji} {task.name}</div>
          <div style={styles.tapHint}>Tap anywhere to continue</div>
        </>
      )}
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
    gap: 16,
    padding: 24,
    cursor: 'pointer',
  },
  trophy: { fontSize: 96 },
  recordText: {
    fontSize: 42,
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)',
    letterSpacing: 2,
  },
  goodJobText: {
    fontSize: 42,
    fontWeight: 900,
    color: '#166534',
  },
  timeText: {
    fontSize: 72,
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontVariantNumeric: 'tabular-nums',
  },
  bestInfo: {
    fontSize: 20,
    color: '#166534',
    fontWeight: 600,
  },
  taskInfo: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 700,
  },
  tapHint: {
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(0,0,0,0.3)',
    fontWeight: 500,
  },
};
