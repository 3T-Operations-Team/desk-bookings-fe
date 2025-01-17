import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useDeskGroups } from "./services/queries";
import { AxiosError } from "axios";
import store from "./store/store";
import { reset } from "./store/bookingsReducer";

interface AuthContext {
  userEmail: string | null;
  userToken: string | null;
  login(email: string, password: string): void;
  logout(): void;
}

const AuthContext = createContext<AuthContext>({
  userEmail: null,
  userToken: null,
  login: () => {},
  logout: () => {},
});

export const storageLogedUserEmailKey = "logedUserEmail";
export const storageLogedUserTokenKey = "logedUserToken";

export const getStoredUserEmail = () => {
  return localStorage.getItem(storageLogedUserEmailKey);
};

export const getStoredUserToken = () => {
  return localStorage.getItem(storageLogedUserTokenKey);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(
    getStoredUserEmail(),
  );
  const [userToken, setUserToken] = useState<string | null>(
    getStoredUserToken(),
  );

  const { error, isError } = useDeskGroups();

  useEffect(() => {
    if (isError && (error as AxiosError).status === 403) {
      logout();
    }
  }, [isError]);

  const queryClient = useQueryClient();

  const login = (userEmail: string, password: string) => {
    const token = "Basic " + btoa(userEmail + ":" + password);
    localStorage.setItem(storageLogedUserEmailKey, userEmail);
    localStorage.setItem(storageLogedUserTokenKey, token);
    setUserEmail(userEmail);
    setUserToken(password);
    queryClient.invalidateQueries();
    queryClient.clear();
  };

  const logout = () => {
    localStorage.removeItem(storageLogedUserEmailKey);
    localStorage.removeItem(storageLogedUserTokenKey);
    setUserEmail(null);
    setUserToken(null);
    queryClient.invalidateQueries();
    queryClient.clear();
    store.dispatch(reset());
  };

  return (
    <AuthContext.Provider value={{ userEmail, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
