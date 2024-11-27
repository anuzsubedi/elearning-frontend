import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import StudentHome from "./pages/StudentHome";
import TeacherHome from "./pages/TeacherHome";
import CourseCreation from "./pages/CourseCreation";
import EditCoursePage from "./pages/EditCoursePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherRoute from "./components/TeacherRoute";
import NotFound from "./pages/NotFound";

const App = () => {
    const { user } = useAuth(); // Get the current user from AuthContext

    return (
        <>
            <Routes>
                {/* Default route */}
                <Route
                    path="/"
                    element={
                        user
                            ? user.user_type === "Instructor"
                                ? <Navigate to="/teacher-home" replace />
                                : <StudentHome />
                            : <Login />
                    }
                />

                {/* Login and Signup routes */}
                {!user && <Route path="/login" element={<Login />} />}
                {!user && <Route path="/signup" element={<Signup />} />}

                {/* Teacher-only routes */}
                {user?.user_type === "Instructor" && (
                    <Route element={<TeacherRoute />}>
                        <Route path="/teacher-home" element={<TeacherHome />} />
                        <Route path="/create-course" element={<CourseCreation />} />
                        <Route path="/edit-course/:id" element={<EditCoursePage />} />
                    </Route>
                )}

                {/* Catch-all for unknown routes */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
