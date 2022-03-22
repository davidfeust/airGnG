import React, { createContext, useState } from 'react';

export const AuthenticatedUserContext = createContext({
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
