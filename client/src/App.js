import React from 'react';
import './App.css';
import {useRoutes} from './routes';
import Header from './components/Header/Header'
import {AuthContext} from './context/AuthContext'
import { useAuth } from './hooks/AuthHook';

function App() {
const {token, refreshToken, scope, login, logout, fetchRefreshToken} = useAuth();
const isAuthenticated = !!token;
const routes = useRoutes(isAuthenticated);
  return (
    <AuthContext.Provider value={{token, refreshToken, scope, login, logout, fetchRefreshToken, isAuthenticated}}>
      <div className="App">
        <Header isLogined={isAuthenticated}/>
      {routes}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
