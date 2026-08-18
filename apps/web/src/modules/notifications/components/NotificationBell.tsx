import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Bell, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

import { useNotifications, unreadCount } from "../hooks/useNotifications";
import { useNotificationMutation } from "../hooks/useNotificationMutation";

import type { Notification, NotificationType } from "../types/notification.types";

/** Per-type icon + accent tone for the notification rows. */
const TYPE_META: Record<
  NotificationType,
  { icon: typeof Bell; tone: string }
> = {
  warning: { icon: AlertTriangle, tone: "text-[var(--nebula-warning)]" },
  info: { icon: Info, tone: "text-[var(--nebula-info)]" },
  success: { icon: CheckCircle2, tone: "text-[var(--nebula-success)]" },
  danger: { icon: XCircle, tone: "text-[var(--nebula-danger)]" },
};

/** Format an ISO timestamp as a short, human-friendly date + time. */
function formatDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** A single notification row with a mark-as-read affordance. */
function NotificationRow({
  notification,
  onMarkRead,
  onOpen,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onOpen: (notification: Notification) => void;
}) {
  const meta = TYPE_META[notification.type] ?? TYPE_META.info;
  const Icon = meta.icon;

  return (
    <li
      className={`flex gap-3 px-4 py-3 ${
        notification.read ? "opacity-60" : "bg-[var(--nebula-surface-muted)]/50"
      }`}
    >
      <Icon
        size={16}
        strokeWidth={2}
        className={`mt-0.5 shrink-0 ${meta.tone}`}
        aria-hidden
      />

      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate text-sm font-medium text-[var(--nebula-text-primary)]">
          {notification.title}
        </p>
        <p className="truncate text-xs text-[var(--nebula-text-secondary)]">
          {notification.message}
        </p>
        <time className="mt-1 block text-[11px] text-[var(--nebula-text-muted)]">
          {formatDate(notification.createdAt)}
        </time>
      </button>

      {!notification.read && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          className="shrink-0 self-center rounded-[var(--nebula-radius-sm)] px-2 py-1 text-[11px] font-medium text-[var(--nebula-primary)] hover:bg-[var(--nebula-surface-muted)]"
          aria-label="Mark as read"
        >
          Mark read
        </button>
      )}
    </li>
  );
}

/**
 * Header notification bell with an unread-count badge and a dropdown panel.
 */
export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useNotifications();
  const markRead = useNotificationMutation();

  const count = unreadCount(data);

  /* Close the dropdown on outside click or Escape. */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleOpen(notification: Notification) {
    setOpen(false);

    if (notification.url) {
      navigate(notification.url);
    } else if (!notification.read) {
      markRead.mutate(notification.id);
    }
  }

  function handleMarkRead(id: string) {
    markRead.mutate(id);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-[var(--nebula-radius-md)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] text-[var(--nebula-text-secondary)] shadow-[var(--nebula-shadow-sm)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Bell size={18} strokeWidth={2} aria-hidden />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--nebula-danger)] px-1 text-[10px] font-semibold leading-none text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-lg)]">
          <div className="flex items-center justify-between border-b border-[var(--nebula-border)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--nebula-text-primary)]">
              Notifications
            </p>
            {count > 0 && (
              <span className="rounded-full bg-[var(--nebula-surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--nebula-text-secondary)]">
                {count} unread
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="space-y-2 p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-[var(--nebula-radius-md)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
                  />
                ))}
              </div>
            )}

            {!isLoading && (!data || data.length === 0) && (
              <div className="flex flex-col items-center gap-2 p-10 text-center">
                <Bell
                  size={26}
                  strokeWidth={1.5}
                  className="text-[var(--nebula-text-muted)]"
                  aria-hidden
                />
                <p className="text-sm text-[var(--nebula-text-secondary)]">
                  You&rsquo;re all caught up.
                </p>
              </div>
            )}

            {!isLoading && data && data.length > 0 && (
              <ul className="divide-y divide-[var(--nebula-border)]">
                {data.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onOpen={handleOpen}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
