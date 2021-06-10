import React, {useState, useEffect, useRef, Fragment} from 'react';
import {useHttp} from '../../hooks/HttpHook';
import {useAuth} from "../../hooks/AuthHook";
import config from '../../config/config';

function Admin() {
    const [isLoggined, setLoggined] = useState(false);
    const [users, setUsers] = useState([]);
    const emailRef = useRef();
    const passwordRef = useRef();
    const  {request} = useHttp();
    const auth = useAuth();
    const loginAdmin = async () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try{
            const data = await request(config.baseUrl+'/api/admin/login', 'POST', {email,password});
            if(data && data.token) {
                auth.login(data.token);
                setLoggined(true);
            }
        }catch (e) {
            console.log(e);
        }
    }

    const getUsers = async () => {
        try{
            const data = await request(config.baseUrl+'/api/admin/users', 'GET');
            if(data && data.users) {
                setUsers(data.users);
            }
        }catch (e) {
            console.log(e);
        }
    }

    useEffect(()=>{
        getUsers();
    },[isLoggined])

    return(
        <div>
            <h1>Admin menu</h1>
            {isLoggined?<div>
                <h1>Users</h1>
                <table>
                    {users?users.map((el)=>{
                        return <tr><td>{el.email}</td><td>{el.name}</td><td>{el.is_admin}</td></tr>
                    }):null}
                </table>
            </div>:
                <Fragment>
                    <label>Email</label><br/>
                    <input ref={emailRef}/><br/>
                    <label>Password</label><br/>
                    <input type="password" ref={passwordRef}/><br/>
                    <button onClick={loginAdmin} style={{backgroundColor:'black', color:'white'}}>Увійти</button>
                </Fragment>}
        </div>
    )
}

export default Admin;