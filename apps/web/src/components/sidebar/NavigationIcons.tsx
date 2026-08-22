import type { ComponentType } from "react";

import {
  LayoutDashboard,
  Zap,
  Box,
  Boxes,
  Package,
  Warehouse,
  Users,
  User,
  Wallet,
  BookOpen,
  CreditCard,
  FileText,
  Building,
  Building2,
  Percent,
  Calculator,
  ChartBar,
  BarChart3,
  Settings,
  SlidersHorizontal,
  ShoppingCart,
  Receipt,
  Truck,
  Headset,
  Ticket,
  Wrench,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

/**
 * Map of icon name (as referenced in navigation config) to its lucide component.
 * This bridges the string-based icon field in the navigation config to the
 * actual icon components, keeping the navigation config free of component imports.
 */
export type NavigationIconComponent = ComponentType<{
  size?: number | string;
  className?: string;
}>;

export const iconRegistry: Record<string, NavigationIconComponent> = {
  LayoutDashboard,
  Zap,
  Box,
  Boxes,
  Package,
  Warehouse,
  Users,
  User,
  Wallet,
  BookOpen,
  CreditCard,
  FileText,
  Building,
  Percent,
  Calculator,
  ChartBar,
  Settings,
  SlidersHorizontal,
  ShoppingCart,
  Receipt,
  Truck,
  Headset,
  Ticket,
  Wrench,
  CalendarDays,
  Building2,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
};

export function getIconComponent(iconName: string): NavigationIconComponent {
  return iconRegistry[iconName] || Box;
}
