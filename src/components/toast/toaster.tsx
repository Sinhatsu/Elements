import { CircleAlert, CircleCheck, CircleX, Info, type LucideIcon } from 'lucide-react';
import { useEffect } from 'react';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProviderProps,
  type ToastVariant,
} from './toast';
import { setToastLimit, useToast } from './use-toast';

const variantIcons: Partial<Record<ToastVariant, LucideIcon>> = {
  success: CircleCheck,
  error: CircleX,
  warning: CircleAlert,
  info: Info,
};

type ToasterProps = Pick<
  ToastProviderProps,
  'duration' | 'label' | 'swipeDirection' | 'swipeThreshold'
> & {
  maxVisible?: number;
};

function Toaster({
  duration = 5000,
  label = 'Notifications',
  swipeDirection = 'right',
  swipeThreshold,
  maxVisible = 3,
}: ToasterProps = {}) {
  const { toasts } = useToast();

  useEffect(() => {
    setToastLimit(maxVisible);
  }, [maxVisible]);

  return (
    <ToastProvider
      duration={duration}
      label={label}
      swipeDirection={swipeDirection}
      swipeThreshold={swipeThreshold}
    >
      {toasts.map(function ({ id, title, description, action, variant = 'default', ...props }) {
        const Icon = variantIcons[variant];

        return (
          <Toast
            key={id}
            variant={variant}
            type={variant === 'error' ? 'foreground' : 'background'}
            {...props}
          >
            <div className="flex gap-3.5">
              {Icon ? <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> : null}
              <div className="grid gap-1.5">
                {title ? <ToastTitle>{title}</ToastTitle> : null}
                {description ? <ToastDescription>{description}</ToastDescription> : null}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

export { Toaster, type ToasterProps };
