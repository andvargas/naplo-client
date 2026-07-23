import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, Timelog } from "../types";

// State shape
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeLog: Timelog | null;
}

// Actions
type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER_ACTIVITIES"; payload: string[] }
  | { type: "UPDATE_USER_SETTINGS"; payload: User["settings"] }
  | { type: "SET_ACTIVE_LOG"; payload: Timelog | null };

// Context shape
interface AuthContextType {
  state: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateActivityTypes: (newTypes: string[]) => void;
  user: User | null;
  updateSettings: (settings: User["settings"]) => void;
  activeLog: Timelog | null;
  setActiveLog: (log: Timelog | null) => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  activeLog: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        activeLog: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "UPDATE_USER_ACTIVITIES":
      if (!state.user) return state;
      const updatedUser = { ...state.user, activityTypes: action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };
    case "UPDATE_USER_SETTINGS":
      if (!state.user) return state;
      const updatedSettingsUser = { ...state.user, settings: action.payload };
      localStorage.setItem("user", JSON.stringify(updatedSettingsUser));
      return {
        ...state,
        user: updatedSettingsUser,
      };
    case "SET_ACTIVE_LOG":
      return {
        ...state,
        activeLog: action.payload,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Rehydrate from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        dispatch({ type: 'LOGIN', payload: { user, token } })
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = (user: User, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', payload: { user, token } })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  const updateActivityTypes = (newTypes: string[]) => {
    dispatch({ type: "UPDATE_USER_ACTIVITIES", payload: newTypes });
  };

  const updateSettings = (settings: User["settings"]) => {
    dispatch({
      type: "UPDATE_USER_SETTINGS",
      payload: settings,
    });
  };

  const setActiveLog = (log: Timelog | null) => {
    dispatch({
      type: "SET_ACTIVE_LOG",
      payload: log,
    });
  };

  return (
    <AuthContext.Provider
      value={{ state, login, logout, updateActivityTypes, updateSettings, activeLog: state.activeLog, setActiveLog, user: state.user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}