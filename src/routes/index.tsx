import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/Auth";
import { type ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.state.isAuthenticated);
    const location = useLocation();
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    return children;
};