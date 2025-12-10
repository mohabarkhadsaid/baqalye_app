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
        // Mock login logic
        if (username === "admin" && password === "admin") {
            const userData = {
                username: "admin",
                role: "admin",
                name: "Admin User",
                phone: "+252 61 5000000",
                email: "admin@baqalye.com"
            };
            setUser(userData);
            localStorage.setItem("baqalye_user", JSON.stringify(userData));
            return true;
        }
        return false;
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
        <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
