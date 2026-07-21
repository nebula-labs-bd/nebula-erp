import { useContext } from "react";

import { AuthContext } from "../auth/auth.context";

import {
  rolePermissions,
} from "../permissions/access";

import type {
  Permission,
} from "../permissions/permissions";

export default function usePermission() {
  const auth = useContext(AuthContext);

  function can(
    permission: Permission,
  ) {
    if (!auth?.user) {
      return false;
    }

    return rolePermissions[
      auth.user.role
    ].includes(permission);
  }

  return {
    can,
  };
}