"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { IconCheck, IconAlertCircle, IconInfoCircle, IconX } from "@tabler/icons-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  onUndo?: () => void;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, onUndo?: () => void) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const AUTO_DISMISS_MS = 3500;
const UNDO_DISMISS_MS = 6000;

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", onUndo?: () => void) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const toast: Toast = { id, message, type, onUndo };
      setToasts((prev) => [...prev.slice(-4), toast]); // keep max 5

      const ms = onUndo ? UNDO_DISMISS_MS : AUTO_DISMISS_MS;
      const timer = setTimeout(() => dismiss(id), ms);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — fixed top-center */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-[fadeInDown_0.3s_ease-out] ${
              t.type === "success"
                ? "bg-green-500 text-white"
                : t.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
            }`}
          >
            {t.type === "success" && <IconCheck size={18} />}
            {t.type === "error" && <IconAlertCircle size={18} />}
            {t.type === "info" && <IconInfoCircle size={18} />}
            <span>{t.message}</span>
            {t.onUndo && (
              <button
                onClick={() => {
                  t.onUndo?.();
                  dismiss(t.id);
                }}
                className="ml-1 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[12px] font-semibold transition-colors"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => dismiss(t.id)}
              className="ml-1 p-0.5 rounded hover:bg-white/20 transition-colors"
              aria-label="Dismiss notification"
            >
              <IconX size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
