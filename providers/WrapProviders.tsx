import React, { useContext } from "react";
import {AuthenticatedUserContext, AuthenticatedUserProvider} from "./AuthenticatedUserProvider";
import RootNavigator from "../navigation/RootNavigator";
import {PublicStationsProvider} from "./PublicStationsProvider";
import {MyOrdersProvider} from "./MyOrdersProvider";

/**
 * Wrap all providers here
 */

export default function WrapProviders() {
    return (
        <AuthenticatedUserProvider>
            <PublicStationsProvider>
                <MyOrdersProvider>
                    <RootNavigator/>
                </MyOrdersProvider>
            </PublicStationsProvider>
        </AuthenticatedUserProvider>
    );
}
