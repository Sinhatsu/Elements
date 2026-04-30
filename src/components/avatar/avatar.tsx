import { forwardRef, useState, type ComponentPropsWithoutRef, type ImgHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type AvatarProps = ComponentPropsWithoutRef<'div'>;

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="avatar"
      className={cn(
        'relative flex size-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted',
        className,
      )}
      {...props}
    />
  );
});

Avatar.displayName = 'Avatar';

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = '', onError, onLoad, onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

    if (status === 'error' || !src) {
      return null;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        data-slot="avatar-image"
        className={cn('aspect-square size-full object-cover', className)}
        onLoad={(e) => {
          setStatus('loaded');
          onLoadingStatusChange?.('loaded');
          onLoad?.(e);
        }}
        onError={(e) => {
          setStatus('error');
          onLoadingStatusChange?.('error');
          onError?.(e);
        }}
        {...props}
      />
    );
  },
);

AvatarImage.displayName = 'AvatarImage';

export type AvatarFallbackProps = ComponentPropsWithoutRef<'div'>;

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="avatar-fallback"
        className={cn(
          'flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground',
          className,
        )}
        {...props}
      />
    );
  },
);

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarFallback, AvatarImage };
