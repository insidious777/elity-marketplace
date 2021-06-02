import {useState, useCallback, useContext} from 'react';
import {AuthContext} from '../context/AuthContext'
export const useHttp = () => {
    const {token, isAuthenticated} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [msg, setMsg] = useState(null);
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            function getToken(){
                const storage = JSON.parse(localStorage.getItem('userData'));
                if(storage && Object.keys(storage).length != 0 && storage.token){
                    return storage.token;
                }else return null;
            }
            const token = getToken();
            if(token) headers = {...headers, 'Authorization': `token ${token}`}

            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, {
                method, body, headers
            });
            const data = await response.json();

            if (!response.ok) {
                console.log(data.errors);
                setErrors(data.errors);
                throw new Error(data.message || 'Something wrong!');
            }
            setLoading(false);
            setMsg(data.message);
            return data;

        } catch (e) {
            setLoading(false);
            setMsg(e.message);
            throw e;
        }
    }, []);

    return { loading, request, errors, msg }
}