import React from 'react';

const defaultUserState = {
    roles: [], 
    username: '', 
    isLoggedIn: false,
    isAdmin: false,
    updateUser() {}
};
const { Consumer: UserConsumer, Provider: UserProvider } = React.createContext(defaultUserState);

export {
    UserConsumer, 
    UserProvider,
    defaultUserState
}