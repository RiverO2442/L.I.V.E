import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  authenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  authenticated,
}) => {
  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
