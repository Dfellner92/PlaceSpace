import { useState, useCallback, useRef, useEffect } from 'react';

// useCallback will ensure this hook doesn't get 
//infinitely rerendered.
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    // useRef will store data across rerendered
    //cycles
    const activeHttpRequests = useRef([]);
    
    const sendRequest = useCallback(async (
        url, 
        method = 'GET', 
        body = null, 
        headers = {}
    ) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers
            });
    
            const responseData = await response.json();
           
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    // const clearError = () => {
    //     setError(null)
    // };

    useEffect(() => {
        return () => {
           activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort()); 
        };
    }, []);

    return { isLoading, error, sendRequest }
};