// Adapted from shadcn/ui: https://ui.shadcn.com/docs/components/toast
import { useState, useEffect, useCallback } from "react";

export type ToastVariant = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastContextValue extends ToastState {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<Toast>) => void;
}

// Custom hook to generate unique IDs
const useId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Default toast duration (in milliseconds)
const DEFAULT_DURATION = 5000;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = useId();

    setToasts((prevToasts) => [
      ...prevToasts,
      { id, ...toast, duration: toast.duration || DEFAULT_DURATION },
    ]);

    // Auto-dismiss after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || DEFAULT_DURATION);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, toast: Partial<Toast>) => {
    setToasts((prevToasts) =>
      prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  }, []);

  return {
    toasts,
    toast: addToast,
    dismiss: removeToast,
    update: updateToast,
  };
}
