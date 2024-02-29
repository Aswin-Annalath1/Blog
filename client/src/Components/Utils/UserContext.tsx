import React, { createContext, useState, ReactNode } from "react";

interface UserContextProps {
  userInfo: any; // Replace 'any' with the actual type of userInfo
  setUserInfo: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with the actual type of userInfo
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps>({ userInfo: {}, setUserInfo: () => {} });

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userInfo, setUserInfo] = useState<any>({}); // Replace 'any' with the actual type of userInfo

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
