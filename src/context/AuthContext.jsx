import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from storage on app load
    useEffect(() => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginUser = (userData, stayLoggedIn) => {
        setUser(userData);
        if (stayLoggedIn) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            sessionStorage.setItem("user", JSON.stringify(userData));
        }
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
    };

    const isTeacher = () => user?.user_type === "Instructor";

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, isTeacher }}>
            {children}
        </AuthContext.Provider>
    );
};