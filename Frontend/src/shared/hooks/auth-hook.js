import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDateState, setTokenExpirationDateState] = useState();
    const [userId, setUserId] = useState(false);
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDateState(tokenExpirationDate)
      localStorage.setItem(
        'userData', 
        JSON.stringify({ 
          userId: uid, 
          token: token,
          expiration: tokenExpirationDate.toISOString() 
        })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDateState(null);
      setUserId(null);
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(() => {
      if (token && tokenExpirationDateState) {
        const remainingTime = tokenExpirationDateState.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDateState])
  
    // make sure useEffect is after login,
    // still synchronous
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (
        storedData && 
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    }, [login]);

    return { token, login, logout, userId };
}