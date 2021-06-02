import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';
import s from './Login.module.css';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import InputMask from 'react-input-mask';
import {useHttp} from '../../hooks/HttpHook';
import config from '../../config/config.js';
function Login(){
const history = useHistory();
const auth = useContext(AuthContext);
const [form, setForm] = useState({});
const [error, setError] = useState(null);
const {request, errors, msg} = useHttp();


const changeHandler = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
}

const loginUser = async () => {
    let data;
    try{
        data = await request(config.baseUrl + '/api/auth/login', 'POST', form);
        if(data.token) auth.login(data.token);
    }catch(e){
        console.log(e.errors);
    }
}   

const loginHandler = async (e) => {
    e.preventDefault();
    if(!form['email']) setError('Введіть електронну адресу');
    else if(!form['password']) setError('Введіть пароль');
    else {
        setError('');
        loginUser();
    }
    
}

const displayErrors = () => {
    let err = null;
    if (msg) err = msg;
    if (errors) err = errors[0].msg;
    if (error) err = error;
    return <h2 className={s.error}>{err}</h2>
}
    return(
        <div data-testid="login" className={s.Login}>
            <div className={s.background}>
            </div >
            <div className={s.logForm}>
            <form>
                <h1>Вхід</h1>
                {displayErrors()}
                <input type="text"name="email" onChange={changeHandler} placeholder="Email"/>
                <input type="password"name="password" onChange={changeHandler} placeholder="Пароль"/>
                <div className={s.bottomBar}>
                    <NavLink to='/restore'>Забули пароль?</NavLink>
                    <button onClick={loginHandler}>Увійти</button>
                </div>
            </form>
            <div className={s.regBox}>
                <p>Ще не зареєстровані?</p>
                <NavLink to="/register">Зареєструватись</NavLink>
            </div>
            </div>  
        </div>
    )
}

export default Login;