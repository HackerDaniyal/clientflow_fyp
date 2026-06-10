"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconClock,
  IconTrash,
  IconNote,
} from "@tabler/icons-react";
import { startTimeLog, stopTimeLog, deleteTimeLog } from "@/app/workspace/[id]/actions";
import { useToast } from "@/components/ToastProvider";

interface TimeLog {
  id: string;
  user_id: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  duration_secs: number | null;
  profiles?: { full_name: string } | null;
}

interface TimeTrackerProps {
  workspaceId: string;
  initialTimeLogs: TimeLog[];
  currentUserId: string;
}

function formatDuration(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatTimerDisplay(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimeTracker({ workspaceId, initialTimeLogs, currentUserId }: TimeTrackerProps) {
  const { showToast } = useToast();
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(initialTimeLogs);
  const [description, setDescription] = useState("");
  const [starting, setStarting] = useState(false);
  const [stoppingId, setStoppingId] = useState<string | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Find the currently running timer for this user
  const runningLog = timeLogs.find((l) => l.user_id === currentUserId && !l.end_time);

  // Tick the running timer
  useEffect(() => {
    if (runningLog) {
      const start = new Date(runningLog.start_time).getTime();
      const tick = () => setElapsedSecs(Math.floor((Date.now() - start) / 1000));
      tick();
      timerRef.current = setInterval(tick, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setElapsedSecs(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [runningLog]);

  const handleStart = useCallback(async () => {
    setStarting(true);
    try {
      const log = await startTimeLog(workspaceId, description) as { id: string; start_time: string; description: string };
      setTimeLogs((prev) => [
        { id: log.id, user_id: currentUserId, description: log.description, start_time: log.start_time, end_time: null, duration_secs: null, profiles: null },
        ...prev,
      ]);
      setDescription("");
      showToast("Timer started", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to start timer", "error");
    } finally {
      setStarting(false);
    }
  }, [workspaceId, description, showToast]);

  const handleStop = useCallback(async (logId: string) => {
    setStoppingId(logId);
    try {
      await stopTimeLog(logId);
      setTimeLogs((prev) =>
        prev.map((l) =>
          l.id === logId
            ? {
                ...l,
                end_time: new Date().toISOString(),
                duration_secs: Math.floor(
                  (Date.now() - new Date(l.start_time).getTime()) / 1000
                ),
              }
            : l
        )
      );
      showToast("Timer stopped", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to stop timer", "error");
    } finally {
      setStoppingId(null);
    }
  }, [showToast]);

  const handleDelete = useCallback(async (logId: string) => {
    try {
      await deleteTimeLog(logId);
      setTimeLogs((prev) => prev.filter((l) => l.id !== logId));
      showToast("Time entry deleted", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to delete entry", "error");
    }
  }, [showToast]);

  // Compute total tracked time this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const totalWeekSecs = timeLogs
    .filter((l) => {
      const start = new Date(l.start_time);
      return start >= weekStart && l.duration_secs;
    })
    .reduce((sum, l) => sum + (l.duration_secs || 0), 0);

  // Show the last 5 completed entries
  const completedLogs = timeLogs
    .filter((l) => l.end_time)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
    .slice(0, 5);

  return (
    <div className="card bg-white p-6 space-y-5">
      {/* Header with week total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-tint rounded-xl flex items-center justify-center">
            <IconClock size={22} className="text-brand-dark" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-dark">Time Tracker</h3>
            <p className="text-[11px] text-text-tertiary">
              This week: <span className="font-medium text-brand-dark">{formatDuration(totalWeekSecs)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Running timer display + controls */}
      {runningLog ? (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-accent/5 border border-brand-accent/20">
          <div className="text-3xl font-mono font-bold text-brand-accent tabular-nums">
            {formatTimerDisplay(elapsedSecs)}
          </div>
          <div className="flex-1 min-w-0">
            {runningLog.description && (
              <p className="text-sm text-brand-dark truncate">{runningLog.description}</p>
            )}
            <p className="text-[11px] text-text-tertiary">
              Started {new Date(runningLog.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            onClick={() => handleStop(runningLog.id)}
            disabled={stoppingId === runningLog.id}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            aria-label="Stop timer"
          >
            <IconPlayerStop size={16} />
            {stoppingId === runningLog.id ? "Stopping..." : "Stop"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <IconNote size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !starting && handleStart()}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-light/40 text-sm bg-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 transition-colors"
              aria-label="Timer description"
            />
          </div>
          <button
            onClick={handleStart}
            disabled={starting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 transition-colors disabled:opacity-50"
            aria-label="Start timer"
          >
            <IconPlayerPlay size={16} />
            {starting ? "Starting..." : "Start"}
          </button>
        </div>
      )}

      {/* Recent time entries */}
      {completedLogs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Recent Entries</h4>
          {completedLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-brand-surface/50 group transition-colors"
            >
              <IconClock size={14} className="text-text-tertiary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-dark truncate">
                  {log.description || "No description"}
                </p>
                <p className="text-[11px] text-text-tertiary">
                  {new Date(log.start_time).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {new Date(log.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {log.profiles?.full_name && ` · ${log.profiles.full_name}`}
                </p>
              </div>
              <span className="text-sm font-medium text-brand-dark tabular-nums">
                {log.duration_secs ? formatDuration(log.duration_secs) : "—"}
              </span>
              {log.user_id === currentUserId && (
                <button
                  onClick={() => handleDelete(log.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                  aria-label="Delete time entry"
                >
                  <IconTrash size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
