import { useState, useEffect, createContext, useContext, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 max-w-lg mx-auto pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 2500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className="fade-in pointer-events-auto bg-[#151230] rounded-xl px-4 py-3 shadow-lg border border-[#1E1B3A] flex items-center gap-3">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: toast.type === "success" ? "#22C55E" : "#EF4444" }}
      />
      <span className="text-[14px] text-white flex-1">{toast.message}</span>
    </div>
  );
}
