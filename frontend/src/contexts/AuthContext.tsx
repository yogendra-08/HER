import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser, isAuthenticated, type LocalUser } from '../utils/localStorageAuth';

type AuthContextType = {
  user: Omit<LocalUser, 'password'> | null;
  session: { token: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<LocalUser, 'password'> | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          const token = localStorage.getItem('vastraverse_token');
          if (currentUser && token) {
            setUser(currentUser);
            setSession({ token });
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, token } = loginUser(email, password);
      setUser(loggedInUser);
      setSession({ token });
      return { data: { user: loggedInUser, token }, error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Login failed' } };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { user: newUser, token } = registerUser({
        email,
        password,
        name: userData.fullName || userData.name || '',
        phone: userData.phone,
        address: userData.address,
      });
      setUser(newUser);
      setSession({ token });
      return { data: { user: newUser, token }, error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Signup failed' } };
    }
  };

  // Sign out
  const signOut = async () => {
    logoutUser();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
