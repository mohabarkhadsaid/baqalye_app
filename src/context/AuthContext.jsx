import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem("baqalye_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        const storedUsers = JSON.parse(localStorage.getItem("baqalye_users") || "[]");
        const foundUser = storedUsers.find(u => u.username === username && u.password === password);

        if (foundUser) {
            // Don't store password in session
            const { password, ...safeUser } = foundUser;
            setUser(safeUser);
            localStorage.setItem("baqalye_user", JSON.stringify(safeUser));
            return true;
        }
        return false;
    };

    const register = (userData) => {
        const storedUsers = JSON.parse(localStorage.getItem("baqalye_users") || "[]");

        // Check if username exists
        if (storedUsers.some(u => u.username === userData.username)) {
            return { success: false, message: "Username already exists" };
        }

        const newUser = { ...userData, role: "admin" }; // Default to admin for now
        storedUsers.push(newUser);
        localStorage.setItem("baqalye_users", JSON.stringify(storedUsers));

        // Auto login after register
        const { password, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem("baqalye_user", JSON.stringify(safeUser));

        return { success: true };
    };

    const updateProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem("baqalye_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("baqalye_user");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
