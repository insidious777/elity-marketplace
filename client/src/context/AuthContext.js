import {createContext} from 'react';

function noop() {}

export const AuthContext = createContext({
    token: null,
    refreshToken: null,
    scope: null,
    login: noop,
    logout: noop,
    fetchRefreshToken: noop,
    isAuthenticated: false,
});