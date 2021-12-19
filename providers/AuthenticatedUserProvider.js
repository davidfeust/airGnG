import React, {createContext, useState} from "react";

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return (
        <AuthenticatedUserContext.Provider value={{user: user, setUser: setUser}}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};
