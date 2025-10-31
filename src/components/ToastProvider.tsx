// src/components/ToastProvider.tsx
import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { Snackbar, Alert, Button } from '@mui/material'
import type { AlertColor } from '@mui/material'
import type { PropsWithChildren } from 'react'

type ToastOptions = {
  severity?: AlertColor        // 'success' | 'info' | 'warning' | 'error'
  duration?: number            // ms
  actionLabel?: string
  onAction?: () => void
}

type ToastState = {
  open: boolean
  message: string
  severity: AlertColor
  duration: number
  actionLabel?: string
  onAction?: () => void
}

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
    duration: 2500,
  })

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    setToast({
      open: true,
      message,
      severity: options?.severity ?? 'success',
      duration: options?.duration ?? 2500,
      actionLabel: options?.actionLabel,
      onAction: options?.onAction,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }))
  }, [])

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{ alignItems: 'center' }}
          action={
            toast.actionLabel ? (
              <Button size="small" onClick={() => { toast.onAction?.(); hideToast() }}>
                {toast.actionLabel}
              </Button>
            ) : undefined
          }
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
