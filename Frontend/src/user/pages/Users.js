import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    //const [isLoading, setIsLoading] = useState(false);
    //const [error, setError] = useState();
    const [loadedUsers, setLoadedUsers] = useState();
    // const USERS = [
    //     {
    //         id: 'u1', 
    //         name: 'Dan Fellner', 
    //         image: 'https://i.picsum.photos/id/997/200/300.jpg?hmac=NeXq5MvhpKvGEq_X3jULp2C3Lg-8IQK8bdtnyJeXDIQ', 
    //         places: 3
    //     }
    // ];
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users'
                );
                setLoadedUsers(responseData.users);
            } catch (err) {}
        };
        fetchUsers();
        // using useCallback in http-hook allows
        // sendRequest not to be rerendered
    }, [sendRequest]);

    

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>};
        </React.Fragment>
    )
};

export default Users;