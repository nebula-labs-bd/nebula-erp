import { Circle, AlertTriangle, XCircle, Wrench } from "lucide-react";

export type SystemStatusVariant = "online" | "warning" | "offline" | "maintenance";

interface SystemStatusProps {
  variant: SystemStatusVariant;
  /** Show text label next to indicator */
  showLabel?: boolean;
  /** Compact mode - only show the dot indicator */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

const variantConfig: Record<SystemStatusVariant, { icon: typeof Circle; label: string; colorToken: string }> = {
  online: { icon: Circle, label: "System Online", colorToken: "var(--nebula-status-success)" },
  warning: { icon: AlertTriangle, label: "System Warning", colorToken: "var(--nebula-status-warning)" },
  offline: { icon: XCircle, label: "System Offline", colorToken: "var(--nebula-status-error)" },
  maintenance: { icon: Wrench, label: "Maintenance", colorToken: "var(--nebula-status-info)" },
};

/**
 * System Status Indicator Component
 *
 * Displays system health status with animated pulse/glow effects.
 * Uses Nebula theme tokens for colors to support all themes.
 *
 * Variants:
 * - online: Green pulse indicator
 * - warning: Yellow pulse indicator
 * - offline: Red pulse indicator
 * - maintenance: Blue pulse indicator
 */
export default function SystemStatus({
  variant,
  showLabel = true,
  compact = false,
  className = ""
}: SystemStatusProps) {
  const { icon: Icon, label, colorToken } = variantConfig[variant];

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative flex-shrink-0">
        {/* Glow ring - animated */}
        <div
          className="absolute inset-0 rounded-full opacity-0 animate-ping"
          style={{
            backgroundColor: colorToken,
            animationDuration: "2s",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          }}
          aria-hidden="true"
        />
        {/* Main indicator */}
        <Icon
          size={compact ? 8 : 10}
          className="relative z-10 transition-all duration-300 ease-out nebula-breathe"
          style={{ color: colorToken }}
          aria-hidden="true"
        />
        {/* Inner pulse dot for online status */}
        {variant === "online" && !compact && (
          <div
            className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
            style={{
              backgroundColor: colorToken,
              width: "4px",
              height: "4px",
              animationDuration: "2s",
              animationTimingFunction: "ease-in-out",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {!compact && showLabel && (
        <span
          className="text-xs font-medium text-[var(--nebula-text-secondary)] transition-colors duration-200"
          style={{ color: colorToken }}
        >
          {label}
        </span>
      )}
    </div>
  );
}