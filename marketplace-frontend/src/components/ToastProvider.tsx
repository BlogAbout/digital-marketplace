// src/components/ToastProvider.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  message: string;
  type: AlertColor;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: AlertColor, title?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: AlertColor = 'success', title?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 9999,
            }}
          >
            <Alert
              severity={toast.type}
              variant="filled"
              sx={{ borderRadius: 3, minWidth: 300 }}
              onClose={() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
              }}
            >
              {toast.title && (
                <strong style={{ display: 'block', marginBottom: 4 }}>
                  {toast.title}
                </strong>
              )}
              {toast.message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
