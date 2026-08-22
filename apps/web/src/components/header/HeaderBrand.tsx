import { Zap } from "lucide-react";
import { appConfig } from "../../config/app.config";
import { useTheme } from "../../theme/useTheme";

/**
 * Header branding component.
 * Displays the application logo, name, and tagline.
 * Adapts to mobile/collapsed states by showing only the logo.
 */
export default function HeaderBrand() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      {/* Logo */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0%, ${theme.tokens["--nebula-accent"]} 100%)`,
        }}
      >
        <Zap className="h-6 w-6 text-white" />
      </div>

      {/* Brand Identity - Hidden on small screens */}
      <div className="hidden flex-col leading-tight lg:flex">
        <span className="text-sm font-bold text-[var(--nebula-text-primary)]">
          {appConfig.name}
        </span>
        <span className="text-[11px] font-medium text-[var(--nebula-text-secondary)] uppercase tracking-wider">
          {appConfig.tagline}
        </span>
      </div>
    </div>
  );
}
