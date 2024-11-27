import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import StudentHome from "./pages/StudentHome";
import TeacherHome from "./pages/TeacherHome";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Include Signup page
import TeacherRoute from "./components/TeacherRoute";
import NotFound from "./pages/NotFound";

const App = () => (
    <>
        <Routes>
            {/* Default route for students */}
            <Route path="/" element={<StudentHome />} />

            {/* Login and Signup routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Teacher-only routes */}
            <Route element={<TeacherRoute />}>
                <Route path="/teacher-home" element={<TeacherHome />} />
            </Route>

            {/* Catch-all for unknown routes */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    </>
);

export default App;
