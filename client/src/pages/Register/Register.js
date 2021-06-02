import React, {useState, useContext} from 'react';
import {NavLink} from 'react-router-dom';
import s from './Register.module.css';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import {useHttp} from '../../hooks/HttpHook';
import config from '../../config/config.js';
import InputMask from 'react-input-mask';
function Register(){
const history = useHistory();
const auth = useContext(AuthContext);
const {request, errors, msg} = useHttp();
const [error, setError] = useState(null);
const changeHandler = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
}


const [form, setForm] = useState({});
    
    const registerUser = async () =>{
        let data;
        try{
            data = await request(config.baseUrl + '/api/auth/register', 'POST', form);
        }catch(e){
            console.log(e);
        }
        if(data && data.message && data.message === 'Користувача створено') history.push('/login')
        console.log(data);
    }

    const displayErrors = () => {
        let err = null;
        if (msg) err = msg;
        if (errors) err = errors[0].msg;
        if (error) err = error;
        return <h2 className={s.error}>{err}</h2>
    }

    const registerHandler = async (e) => {
        e.preventDefault();
        if(!form['name']) setError("Введіть ім'я");
        else if(!form['email']) setError('Введіть електронну пошту');
        else if(!form['password']) setError('Введіть пароль');
        else if(!form['secondPass']) setError('Введіть пароль ще раз');
        else {
            setError('');
            registerUser();
        }
    }
    return(
        <div data-testid="register" className={s.Register}>
            <div className={s.background}>
            </div >
            <div className={s.regForm}>
            <form>
                <h1>Реєстрація</h1>
                {displayErrors()}
                <input name="name" onChange={changeHandler} placeholder="Ім'я"/>
                <input name="email" onChange={changeHandler} placeholder="Email"/>
                <input name="password" type="password" onChange={changeHandler} placeholder="Пароль"/>
                <input name="secondPass" type="password" onChange={changeHandler} placeholder="Повторіть пароль"/>
                <div className={s.bottomBar}>
                    <div>
                    <p>Вже зареєстровані?</p>
                    <NavLink to='/login'>Увійти</NavLink>
                    </div>
                    <button onClick={registerHandler}>Зареєструватись</button>
                </div>
            </form>
            </div>  
        </div>
    )
}

export default Register;