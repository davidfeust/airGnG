import React from "react";
import {AuthenticatedUserProvider} from "./AuthenticatedUserProvider";
import RootNavigator from "../navigation/RootNavigator";
import {PublicStationsProvider} from "./PublicStationsProvider";
import {MyOrdersProvider} from "./MyOrdersProvider";
import {OrdersProvider} from "./OrdersProvider";

/**
 * Wrap all providers here
 */

export default function WrapProviders() {
    return (
        <AuthenticatedUserProvider>
            <PublicStationsProvider>
                <MyOrdersProvider>
                    {/*<OrdersProvider>*/}
                        <RootNavigator/>
                    {/*</OrdersProvider>*/}
                </MyOrdersProvider>
            </PublicStationsProvider>
        </AuthenticatedUserProvider>
    );
}
