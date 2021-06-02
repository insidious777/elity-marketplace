import {useState, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import jwt from 'jwt-decode';
import config from '../config/config.js'
export const useAuth = () => {
    const STORAGE_NAME = 'userData';
    //const dispatch = useDispatch();
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const login = useCallback((jwtToken) => {
        if(jwtToken){
            setToken(jwtToken);
            localStorage.setItem(STORAGE_NAME, JSON.stringify({
                token: jwtToken,
            }))
        }
    }, []);


    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem(STORAGE_NAME);
    }, []);


    // const fetchRefreshToken = async() => {
    //     const tokenRefreshResponse = await fetch(config.baseUrl + '/api/v1/user/token/refresh', {
    //         method:'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body:JSON.stringify({
    //             "refresh":refreshToken
    //         })
    //     });
    //     const data = await tokenRefreshResponse.json();
    //     login(data.access, refreshToken);
    //     return data.access;
    // }

    useEffect(()=>{
        let data;
        if(localStorage.getItem(STORAGE_NAME))
        data = JSON.parse(localStorage.getItem(STORAGE_NAME));
        
        if(data && data.token) {
            login(data.token);
        }

    },[login])

    return { login, logout, token}
}