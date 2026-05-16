"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle size={16} className="text-accent" />,
    error: <XCircle size={16} className="text-danger" />,
    info: <Info size={16} className="text-primary" />,
  };

  const borders = {
    success: "border-accent/30",
    error: "border-danger/30",
    info: "border-primary/30",
  };

  return (
    <ToastContext value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed right-4 top-20 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-xl border bg-surface px-4 py-3 shadow-xl animate-[slideIn_0.2s_ease-out] ${borders[t.type]}`}
          >
            {icons[t.type]}
            <span className="text-sm text-white">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-2 text-zinc-500 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}
