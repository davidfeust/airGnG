import { User } from 'firebase/auth';
import React, { createContext, useState } from 'react';
import { AirGnGUser } from '../App.d';

export const AuthenticatedUserContext = createContext<{
    user: AirGnGUser;
    setUser(user: AirGnGUser): void;
}>({
    user: null,
    setUser: null,
});

export const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthenticatedUserContext.Provider value={{ user, setUser }}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};
