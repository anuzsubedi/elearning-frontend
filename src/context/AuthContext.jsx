import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    const isTeacher = () => user?.user_type === "Instructor";

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, isTeacher }}>
            {children}
        </AuthContext.Provider>
    );
};
