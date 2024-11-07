import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/useUser";

export default function ProtectedRoute() {
    const { user } = useUser()
    if (!user || !user.token) return <Navigate to="signin" />
    return <Outlet />
}