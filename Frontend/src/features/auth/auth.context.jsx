import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [initializing, setInitializing] = useState(true)

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, initializing, setInitializing }}>
            {children}
        </AuthContext.Provider>
    )
}