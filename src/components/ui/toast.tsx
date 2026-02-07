"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 200);
    }, 5000);

    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, onDismiss]);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  }

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-200",
        visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
        {
          "border-fern/30 bg-fern/10": toast.variant === "success",
          "border-red-500/30 bg-red-900/20": toast.variant === "error",
          "border-forest/30 bg-forest/10": toast.variant === "info",
          "border-copper/30 bg-copper/10": toast.variant === "warning",
        }
      )}
    >
      <div className="flex-1 space-y-1">
        <p
          className={cn("text-sm font-semibold", {
            "text-fern": toast.variant === "success",
            "text-red-400": toast.variant === "error",
            "text-forest": toast.variant === "info",
            "text-copper": toast.variant === "warning",
          })}
        >
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-xs text-muted-foreground">{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
