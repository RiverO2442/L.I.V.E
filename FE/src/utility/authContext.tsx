import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define proper TypeScript interfaces
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with proper typing
const AuthContext = createContext<AuthContextType | null>(null);

// Enhanced AuthProvider with proper error handling and token validation
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("accessToken");

      // You can add token validation logic here
      if (token) {
        // Optionally validate token format/expiry
        try {
          // Example: Check if token is valid JSON or not expired
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid token, remove it
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token: string) => {
    if (!token) {
      console.error("Token is required for login");
      return;
    }

    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  // Show loading state while initializing
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Enhanced useAuth hook with error handling
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// ===========================================
// USAGE EXAMPLES IN CHILD COMPONENTS
// ===========================================

// Example 1: Simple component using authentication
const UserProfile: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h1>Welcome to your profile!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Example 2: Navigation component (like your header)
const Navigation: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      // Redirect to login page or show login form
      // login("your-token-here"); // Call this after successful login
    }
  };

  return (
    <nav>
      <div>My App</div>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
          </>
        )}
        <li>
          <button onClick={handleAuthAction}>
            {isAuthenticated ? "Logout" : "Login"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Example 3: Protected Route component
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You need to be logged in to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Example 4: Login form component
const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Your login API call here
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully logged in, save token
        login(data.accessToken);
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

// Example 5: App setup with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Navigation />
        <main>
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
          {/* Other components */}
        </main>
      </div>
    </AuthProvider>
  );
};

// Example 6: Custom hook for conditional rendering
const useAuthActions = () => {
  const { isAuthenticated } = useAuth();

  return {
    showAuthenticatedContent: isAuthenticated,
    showGuestContent: !isAuthenticated,
    isAuthenticated,
  };
};

// Example 7: Using the custom hook
const ConditionalContent: React.FC = () => {
  const { showAuthenticatedContent, showGuestContent } = useAuthActions();

  return (
    <div>
      {showGuestContent && (
        <div>
          <h2>Welcome, Guest!</h2>
          <LoginForm />
        </div>
      )}

      {showAuthenticatedContent && (
        <div>
          <h2>Welcome back!</h2>
          <UserProfile />
        </div>
      )}
    </div>
  );
};

export default App;
