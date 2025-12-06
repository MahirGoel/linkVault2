import { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // todo: remove mock functionality - replace with real Google OAuth
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: undefined,
  });

  const login = () => {
    // todo: implement real Google OAuth login
    setUser({
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
