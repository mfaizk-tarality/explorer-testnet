"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Props as PageProps } from "lib/next/getServerSideProps";
import { apiRouterCall } from "ApiConfig/services";

type UserType = {
  // Define the shape of the user object
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
};

type AppContextType = {
  pageProps: PageProps;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  getProfileHandler: () => Promise<void>;
};

type Props = {
  children: React.ReactNode;
  pageProps: PageProps;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children, pageProps }: Props) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [approvedTokenList, setApprovedTokenList] = useState([]);

  // Fetch profile data
  const getProfileHandler = async () => {
    try {
      const res = await apiRouterCall({
        method: "GET",
        endPoint: "getProfile",
      });
      if (res.data.responseCode === 200) {
        setUser(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  const getApprovedToken = async () => {
    try {
      const res = await apiRouterCall({
        method: "GET",
        endPoint: "getTokens",
      });
      if (res.data.responseCode === 200) {
        setApprovedTokenList(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setApprovedTokenList([]);
    }
  };

  useEffect(() => {
    setIsClient(true);
    getApprovedToken();
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = sessionStorage.getItem("explorerToken"); // Accessing sessionStorage after ensuring we're on the client
      if (token) {
        getProfileHandler();
      }
    }
  }, [isClient]);

  return (
    <AppContext.Provider
      value={{ pageProps, user, setUser, getProfileHandler, approvedTokenList }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
