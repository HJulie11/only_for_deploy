import React, { createContext, useState, useEffect } from 'react';
import LocalStorage from '@/constants/localstorage';

interface StoreContextProps {
  url: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}



export const storeContext = createContext<StoreContextProps>({
  // url: process.env.NEXT_PUBLIC_API_URL || 'https://only-for-deploy-8gs1.vercel.app',
  url: 'https://only-for-deploy-8gs1.vercel.app',
  // url:  'http://localhost:4000',
  // url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  token: '',
  setToken: () => {}
});

const StoreContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const url = process.env.NEXT_PUBLIC_API_URL || 'https://only-for-deploy-8gs1.vercel.app';
  const url = 'https://only-for-deploy-8gs1.vercel.app';
  // const url = 'http://localhost:4000';
  // const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [token, setToken] = useState<string>(LocalStorage.getItem('token') || '');

  useEffect(() => {
    const localToken = LocalStorage.getItem('token');
    if (localToken) {
      setToken(localToken);
      console.log('Token found in localStorage:', localToken);
    }
  }, []);

  const contextValue = {
    url,
    token,
    setToken
  };

  return (
    <storeContext.Provider value={contextValue}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreContextProvider;