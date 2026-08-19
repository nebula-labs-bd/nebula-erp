import type { Permission } from "../permissions/permissions";

/**
 * Navigation item types for the enterprise ERP navigation system.
 * Supports single links, grouped links, and permission-based visibility.
 */

export type NavigationItemType = "link" | "group";

export interface NavigationItemBase {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  permission?: Permission;
  type: NavigationItemType;
}

export interface NavigationLink extends NavigationItemBase {
  type: "link";
  path: string;
  children?: never;
}

export interface NavigationGroup extends NavigationItemBase {
  type: "group";
  path?: never;
  children: NavigationLink[];
}

export type NavigationItem = NavigationLink | NavigationGroup;

/**
 * Checks if a navigation item is a group
 */
export function isNavigationGroup(item: NavigationItem): item is NavigationGroup {
  return item.type === "group";
}

/**
 * Checks if a navigation item is a link
 */
export function isNavigationLink(item: NavigationItem): item is NavigationLink {
  return item.type === "link";
}

/**
 * Flattens navigation items to get all links (including nested ones)
 */
export function flattenNavigationItems(items: NavigationItem[]): NavigationLink[] {
  const result: NavigationLink[] = [];

  for (const item of items) {
    if (isNavigationLink(item)) {
      result.push(item);
    } else if (isNavigationGroup(item)) {
      result.push(...flattenNavigationItems(item.children));
    }
  }

  return result;
}

/**
 * Finds a navigation item by path
 */
export function findNavigationItemByPath(
  items: NavigationItem[],
  path: string,
): NavigationLink | undefined {
  for (const item of items) {
    if (isNavigationLink(item) && item.path === path) {
      return item;
    }
    if (isNavigationGroup(item)) {
      const found = findNavigationItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return undefined;
}