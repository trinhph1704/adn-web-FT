/**
 * Custom Hook: useAuth
 * Quản lý authentication state với Firebase
 */
'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithCustomToken,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User, UserRole } from '@/types';

// ==================== TYPES ====================

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  clearError: () => void;
}

// ==================== CONTEXT ====================

const AuthContext = createContext<AuthContextType | null>(null);

// ==================== PROVIDER ====================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    error: null,
  });

  // Fetch user data from Firestore
  const fetchUserData = useCallback(async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: uid,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          role: data.role,
          isActive: data.isActive,
          avatarUrl: data.avatarUrl,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.uid);
        setState({
          user: userData,
          firebaseUser,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          firebaseUser: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  // Login with email/password
  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Call backend API for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      // Sign in with custom token from backend
      await signInWithCustomToken(auth, data.data.token);

      // State will be updated by onAuthStateChanged listener
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Đã xảy ra lỗi',
      }));
      throw error;
    }
  }, []);

  // Login with custom token
  const loginWithToken = useCallback(async (token: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await signInWithCustomToken(auth, token);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Đã xảy ra lỗi',
      }));
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      // Clear any local storage
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Đăng xuất thất bại',
      }));
      throw error;
    }
  }, []);

  // Check if user has specific role(s)
  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!state.user) return false;

      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(state.user.role);
    },
    [state.user]
  );

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    loginWithToken,
    logout,
    isAuthenticated: !!state.user,
    hasRole,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==================== HOOK ====================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// ==================== HELPER HOOKS ====================

/**
 * Hook để protect routes
 */
export function useRequireAuth(requiredRoles?: UserRole | UserRole[]) {
  const { user, loading, hasRole } = useAuth();

  const isAuthorized = !requiredRoles || (user && hasRole(requiredRoles));

  return {
    user,
    loading,
    isAuthorized,
  };
}

/**
 * Hook để get current user ID
 */
export function useUserId() {
  const { user } = useAuth();
  return user?.id || null;
}

export default useAuth;

