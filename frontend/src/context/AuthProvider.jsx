import { createContext, useCallback, useContext, useState } from "react";

export const AuthContext = createContext(null);

const savedUserKey = "songs_app_user";
const savedTokenKey = "songs_app_token";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = window.localStorage.getItem(savedUserKey);
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            window.localStorage.removeItem(savedUserKey);
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return window.localStorage.getItem(savedTokenKey) || null;
    });

    const login = useCallback((nextUser, accessToken) => {
        setUser(nextUser);
        setToken(accessToken);

        window.localStorage.setItem(savedUserKey, JSON.stringify(nextUser));
        window.localStorage.setItem(savedTokenKey, accessToken);
    }, []);

    const loginWithSpotify = () => {
        window.location.href = "http://127.0.0.1:5000/auth/spotify";
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        window.localStorage.removeItem(savedUserKey);
        window.localStorage.removeItem(savedTokenKey);
    };

    const value = {
        user,
        token,
        loginWithSpotify,
        completeSpotifyLogin: login,
        logout,
        isAuthenticated: Boolean(user && token),
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
