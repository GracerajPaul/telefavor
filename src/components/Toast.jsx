"use client";
import { createContext, useContext, useState, useCallback } from "react";
import Icon from "./Icon";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[13px] font-medium animate-fadeIn ${
              t.type === "error"
                ? "bg-bg-dark border-red/30 text-red"
                : "bg-bg-dark border-border text-text"
            }`}
          >
            <Icon name={t.type === "error" ? "x" : "check"} size={14} className={t.type === "error" ? "text-red" : "text-green"} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
