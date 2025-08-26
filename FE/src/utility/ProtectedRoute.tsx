// src/utility/ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "../service/service"; // adjust import path

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        // try /me first
        await AuthService.me();
        if (!cancelled) {
          setAuthenticated(true);
          setAuthChecked(true);
        }
      } catch {
        if (!cancelled) {
          setAuthenticated(false);
          setAuthChecked(true);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!authChecked) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
