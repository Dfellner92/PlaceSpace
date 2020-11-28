import React from 'react';

import UsersList from '../components/UsersList';


const Users = () => {
    const USERS = [
        {
            id: 'u1', 
            name: 'Dan Fellner', 
            image: 'https://i.picsum.photos/id/997/200/300.jpg?hmac=NeXq5MvhpKvGEq_X3jULp2C3Lg-8IQK8bdtnyJeXDIQ', 
            places: 3
        }
    ];

    return <UsersList items={USERS}/>;
};

export default Users;