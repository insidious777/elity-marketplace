import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from './pages/Home/Home';
import AddLot from './pages/AddLot/AddLot';
import Register from './pages/Register/Register';
import Profile from "./pages/Profile/Profile";
import Login from './pages/Login/Login';
import Restore from './pages/Restore/Restore';
import Product from './pages/Product/Product';
import MyProducts from "./pages/MyProducts/MyProducts";
export const useRoutes = (isAuthenticated) =>{
    console.log('isAuthenticated:', isAuthenticated);
    if(isAuthenticated) return(
                <Switch>
                    <Route path="/create/lot">
                        <AddLot/>
                    </Route>
                    <Route path="/product/:params">
                        <Product/>
                    </Route>
                    <Route path="/profile">
                        <Profile/>
                    </Route>
                    <Route exact path="/products/all">
                        <Home/>
                    </Route>
                    <Route exact path="/products/popular">
                        <Home/>
                    </Route>
                    <Route exact path="/products/saved">
                        <Home/>
                    </Route>
                    <Route exact path="/register">
                        <Register/>
                    </Route>
                    <Route exact path="/profile/settings">
                        <Profile/>
                    </Route>
                    <Route exact path="/profile/payment">
                        <Profile/>
                    </Route>
                    <Route exact path="/products/my">
                        <MyProducts/>
                    </Route>
                    <Redirect to="/products/popular"/>
                </Switch>
            );
    else return(
            <Switch>
            <Route path="/restore">
                <Restore/>
            </Route>
            <Route path="/register">
                <Register/>
            </Route>
            <Route path="/login">
                <Login/>
            </Route>
            <Route path="/create/lot">
                <AddLot/>
            </Route>
            <Route path="/product/:params">
                <Product/>
            </Route>
            <Route exact path="/products/all">
                <Home/>
            </Route>
            <Route exact path="/products/popular">
                <Home/>
            </Route>
            <Route exact path="/products/saved">
                <Home/>
            </Route>
            <Route exact path="/products/my">
                <MyProducts/>
            </Route>
            <Redirect to="/products/popular"/>
        </Switch>
        )
}

