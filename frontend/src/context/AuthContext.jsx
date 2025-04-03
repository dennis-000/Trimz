/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer, useContext, useCallback } from "react";
import { BASE_URL } from "../config";

// Initial state setup
const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    role: localStorage.getItem('role') || null,
    token: localStorage.getItem('token') || null,
    unreadNotifications: 0
};

// Create AuthContext
export const AuthContext = createContext(initialState);

// Reducer to handle login, logout, and other actions
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                user: null,
                role: null,
                token: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                role: action.payload.role,
            };
        case 'LOGOUT':
            localStorage.clear(); // Clear all localStorage items
            return {
                ...state,
                user: null,
                role: null,
                token: null,
                unreadNotifications: 0
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'SET_NOTIFICATION_COUNT':
            return {
                ...state,
                unreadNotifications: action.payload
            };
        default:
            return state;
    }
};

// AuthContextProvider
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Update localStorage when state changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('user');
        }

        if (state.role) {
            localStorage.setItem('role', state.role);
        } else {
            localStorage.removeItem('role');
        }

        if (state.token) {
            localStorage.setItem('token', state.token);
        } else {
            localStorage.removeItem('token');
        }
    }, [state.user, state.role, state.token]);

    // Notification refresh function
    const refreshNotifications = useCallback(async () => {
        if (!state.user || !state.user._id || state.role !== "provider") {
            dispatch({ type: 'SET_NOTIFICATION_COUNT', payload: 0 });
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}notifications/${state.user._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${state.token}`,
                },
            });
            
            if (!res.ok) throw new Error("Failed to fetch notifications");
            
            const data = await res.json();
            const notifications = Array.isArray(data) ? data : data.data || [];
            dispatch({ type: 'SET_NOTIFICATION_COUNT', payload: notifications.length });
        } catch (err) {
            console.error("Error fetching notification count:", err);
            // Don't update the count if there's an error
        }
    }, [state.user, state.token, state.role]);

    // Fetch notifications on login
    useEffect(() => {
        if (state.user && state.user._id && state.role === "provider") {
            refreshNotifications();
        }
    }, [state.user, state.role, refreshNotifications]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                role: state.role,
                unreadCount: state.unreadNotifications,
                dispatch,
                refreshNotifications
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);