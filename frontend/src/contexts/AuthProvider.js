import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  return (
    <AuthProvider.Provider value={{auth, setAuth}}>
      {children}
    </AuthProvider.Provider>
  )
}

export default AuthContext;
