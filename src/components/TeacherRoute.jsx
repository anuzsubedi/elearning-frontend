import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TeacherRoute = () => {
    const { user, isTeacher } = useAuth();

    // Redirect to login if no user is logged in
    if (!user) {
        console.log("Redirecting to /login: No user logged in");
        return <Navigate to="/login" replace />;
    }

    // Redirect to student home if the user is not a teacher
    if (!isTeacher()) {
        console.log(`Redirecting to /: User is not a teacher, user_type: ${user.user_type}`);
        return <Navigate to="/" replace />;
    }

    // Render the protected route if the user is a teacher
    return <Outlet />;
};

export default TeacherRoute;
