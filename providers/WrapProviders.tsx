import React from 'react';
import { AuthenticatedUserProvider } from './AuthenticatedUserProvider';
import RootNavigator from '../navigation/RootNavigator';
import { MyOrdersProvider } from './MyOrdersProvider';

/**
 * Wrap all providers here
 */

export default function WrapProviders() {
    return (
        <AuthenticatedUserProvider>
            <MyOrdersProvider>
                <RootNavigator />
            </MyOrdersProvider>
        </AuthenticatedUserProvider>
    );
}
