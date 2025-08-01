'use client';

import api from "@/services/api";
import { LoginFormInputs, RegisterFormInputs } from "@/types/auth.types";
import { User } from "@/types/user.types";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if(storedToken) {
            try {
                const decodedToken: { sub: string; email: string } = jwtDecode(storedToken);            
                setUser({ id: decodedToken.sub, email: decodedToken.email });
                setToken(storedToken);
                api.defaults.headers.Authorization = `Bearer ${storedToken}`;
            } catch (error) {
                console.error("Invalid token from localStorage", error);
                localStorage.removeItem('authToken');
            }
        }
        setIsLoading(false); //<-- false cuz finished the loading
    }, []);

    const login = async (data: LoginFormInputs) => {
        try {
            const response = await api.post('/auth/login', data);
            const { access_token } = response.data;

            const decodedToken: { sub: string; email: string } = jwtDecode(access_token);
            const loggedUser: User = { id: decodedToken.sub, email: decodedToken.email };

            console.log('[AuthProvider] Login bem-sucedido, definindo usuário:', loggedUser);

            localStorage.setItem('authToken', access_token);
            setUser(loggedUser);
            setToken(access_token);
            api.defaults.headers.Authorization = `Bearer ${access_token}`;

        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    }

    const register = async (data: RegisterFormInputs) => {
        try {
            await api.post('/user/register', data);
        } catch ( error) {
            console.error('SignUp failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
        delete api.defaults.headers.Authorization;// sends the user back to login page
    }

    const contextValue = {
        isAuthenticated: !!user,
        user,
        token,
        login,
        logout,
        register,
        isLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};