import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TeacherRoute = () => {
    const { user, isTeacher } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isTeacher()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default TeacherRoute;
