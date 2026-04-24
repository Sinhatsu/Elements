import { useSyncExternalStore, type ReactNode } from 'react';

import type { ToastActionElement, ToastProps, ToastVariant } from './toast';

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 400;
let toastLimit = TOAST_LIMIT;

type ToasterToast = ToastProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
};

type ActionType =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

interface State {
  toasts: ToasterToast[];
  queue: ToasterToast[];
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

function fillAvailableSlots(toasts: ToasterToast[], queue: ToasterToast[]) {
  const availableSlots = Math.max(toastLimit - toasts.length, 0);
  const nextToasts = queue.slice(0, availableSlots);

  return {
    toasts: [...toasts, ...nextToasts],
    queue: queue.slice(nextToasts.length),
  };
}

function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case 'ADD_TOAST': {
      if (state.toasts.length >= toastLimit) {
        return { ...state, queue: [...state.queue, action.toast] };
      }

      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      };
    }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast,
        ),
        queue: state.queue.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast,
        ),
      };
    case 'DISMISS_TOAST': {
      const { toastId } = action;

      if (toastId && state.queue.some((toast) => toast.id === toastId)) {
        return { ...state, queue: state.queue.filter((toast) => toast.id !== toastId) };
      }

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined ? { ...toast, open: false } : toast,
        ),
        queue: toastId === undefined ? [] : state.queue,
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return { ...state, toasts: [], queue: [] };
      }
      return fillAvailableSlots(
        state.toasts.filter((toast) => toast.id !== action.toastId),
        state.queue,
      );
  }
}

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [], queue: [] };

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function subscribe(listener: (state: State) => void) {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

function getState() {
  return memoryState;
}

function resetToastStore() {
  toastTimeouts.forEach((timeout) => {
    clearTimeout(timeout);
  });
  toastTimeouts.clear();
  memoryState = { toasts: [], queue: [] };
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type ToastInput = Omit<ToasterToast, 'id'>;

function setToastLimit(limit: number) {
  const nextLimit = Math.max(1, Math.floor(limit));

  if (!Number.isFinite(nextLimit) || nextLimit === toastLimit) {
    return;
  }

  toastLimit = nextLimit;
  const visibleToasts = memoryState.toasts.slice(0, toastLimit);
  const overflow = memoryState.toasts.slice(toastLimit);
  memoryState = fillAvailableSlots(visibleToasts, [...overflow, ...memoryState.queue]);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({ ...props }: ToastInput) {
  const id = genId();

  const update = (next: Partial<ToastInput>) => {
    dispatch({ type: 'UPDATE_TOAST', toast: { ...next, id } });
  };

  const dismiss = () => {
    dispatch({ type: 'DISMISS_TOAST', toastId: id });
  };

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });

  return { id, dismiss, update };
}

function dismissToast(toastId?: string) {
  dispatch({ type: 'DISMISS_TOAST', toastId });
}

toast.success = (props: Omit<ToastInput, 'variant'>) => toast({ ...props, variant: 'success' });
toast.error = (props: Omit<ToastInput, 'variant'>) => toast({ ...props, variant: 'error' });
toast.warning = (props: Omit<ToastInput, 'variant'>) => toast({ ...props, variant: 'warning' });
toast.info = (props: Omit<ToastInput, 'variant'>) => toast({ ...props, variant: 'info' });

function useToast() {
  const state = useSyncExternalStore(subscribe, getState, getState);

  return {
    ...state,
    toast,
    dismiss: dismissToast,
  };
}

export {
  toast,
  useToast,
  dismissToast,
  resetToastStore,
  setToastLimit,
  TOAST_LIMIT,
  type ToastInput,
  type ToasterToast,
};
