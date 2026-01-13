import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import type { User } from "../type/User";
import type { Url } from "../type/Url";

axios.defaults.baseURL = import.meta.env.VITE_API_URL!;
axios.defaults.withCredentials = true;

interface AppContextType {
  token: string | null,
  loading: boolean,
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loginUser: (email: string, password: string) => void,
  registerUser: (name: string, email: string, password: string) => void,
  user: User | null,
  urls: Url[],
  fetchUser: () => void,
  fetchUrls: () => void,
  setUrls: React.Dispatch<React.SetStateAction<Url[]>>,
}

const AppContext = createContext<AppContextType | undefined>(undefined)


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null)
  const [urls, setUrls] = useState<Url[]>([]);

  const loginUser = async (email: string, password: string) => {
    console.log(email, password);
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        fetchUser();
      }
    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  const registerUser = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      alert("Please enter name, email and password");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/user/register", {
        name,
        email,
        password
      });
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setUser(response.data.data)
      }
    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  const isAuthenticated = () => {
    return !!token;
  }

  const fetchUser = () => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      setToken(userToken);
    }
  }

  const fetchUrls = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/url/all-urls", { headers: { Authorization: `Bearer ${token}` } })
      console.log(res.data);
      if (res.status === 200) {
        setUrls(res.data)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
      }
    }
    fetchToken();
    fetchUser();
  }, [])


  const value = {
    token,
    setToken,
    loading,
    setLoading,
    isAuthenticated,
    loginUser,
    registerUser,
    user,
    setUrls,
    urls,
    fetchUser,
    fetchUrls
  }

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}