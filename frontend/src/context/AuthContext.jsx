import {
    createContext,
    useContext,
    useState,
    useEffect,
  } from "react";
  
  import authService from "../services/authService";
  
  const AuthContext = createContext();
  
  export const AuthProvider = ({ children }) => {
  
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
  
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  
    // Register
    const register = async (userData) => {
      const data = await authService.register(userData);
  
      setUser(data);
  
      return data;
    };
  
    // Login
    const login = async (userData) => {
      const data = await authService.login(userData);
  
      setUser(data);
  
      return data;
    };
  
    // Logout
    const logout = () => {
      authService.logout();
  
      setUser(null);
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          register,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };