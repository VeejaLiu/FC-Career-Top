import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface HeaderIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  unreadCount?: number;
}

export const HeaderIconButton = forwardRef<
  HTMLButtonElement,
  HeaderIconButtonProps
>(function HeaderIconButton(
  { children, className = '', unreadCount = 0, type = 'button', ...props },
  ref,
) {
  const hasUnread = Number.isFinite(unreadCount) && unreadCount > 0;
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={`header-icon-button ${className}`.trim()}
      aria-label={
        hasUnread
          ? `${props['aria-label']} (${unreadCount})`
          : props['aria-label']
      }
    >
      <span className="header-icon-content">{children}</span>
      {hasUnread && (
        <span className="header-icon-badge" aria-hidden="true">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
});
