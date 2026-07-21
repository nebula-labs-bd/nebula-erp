import { Navigate } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../auth/auth.context";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}