import React, {useState} from 'react';
import s from './Profile.module.css';
import {NavLink} from "react-router-dom";
import defaultPhoto from '../../assets/img/logo.png'

function Profile() {
    const [type, setType] = useState('settings');
    const [form, setForm] = useState({});

    const changeHandler = (e) => {
        console.log(e.target.value)
        console.log(e.target.name)
        //setForm({...form, [e.target.name]: e.target.value})
    }

    const submitHandler = (e) => {
        console.log(form);
    }

    function Settings() {
        return(
            <div className={s.profileContent}>
                <h3>Користувач</h3>
                <label>Фото</label>
                <div className={s.photoChangeBox}>
                    <img src={defaultPhoto}/>
                    <button>Змінити фото</button>
                </div>
                <label>Ім'я</label>
                <input onChange={changeHandler} name="name" placeholder="Андрій"/>
                <label>Номер телефону</label>
                <input onChange={changeHandler} name="phone_number"/>
                <label>Email</label>
                <input onChange={changeHandler} name="email" placeholder="mail@mail.ua" type="email"/>
                <label>Новий пароль</label>
                <input onChange={changeHandler} name="password" type="password"/>
                <button onClick={submitHandler} className={s.saveButton}>Зберегти</button>
            </div>
        )
    }

    function Payment() {
        return(
            <div className={s.profileContent}>
                <h3>Реквізити для оплати</h3>
                <label>Номер картки</label>
                <input onChange={changeHandler} name="card_number" placeholder="5268 4839 0485 2075"/>
                <label>Ім'я</label>
                <input onChange={changeHandler} name="card_name" placeholder="Олександр"/>
                <label>Фамілія</label>
                <input onChange={changeHandler} name="card_lastname" placeholder="Голубець"/>
                <h3 style={{marginTop:'20px'}}>Доставка</h3>
                <label>Місто</label>
                <input onChange={changeHandler} name="city" placeholder="Львів"/>
                <label>Вулиця</label>
                <input onChange={changeHandler} name="street" placeholder="Довженка"/>
                <label>Відділення Нової Пошти</label>
                <input onChange={changeHandler} name="apartment" placeholder="7" type="number"/>
                <button onClick={submitHandler} className={s.saveButton}>Зберегти</button>
            </div>
        )
    }


    return(
        <div className={s.Cabinet}>

            <div className={s.topBar}>
                <ul className={s.list}>
                    <li>
                        <NavLink onClick={()=>{setType('settings')}} activeClassName={s.active} exact to="/profile/settings">
                            <div className={s.listItem}>
                                <h3>Профіль</h3>
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink onClick={()=>{setType('payment')}} activeClassName={s.active} to="/profile/payment">
                            <div className={s.listItem}>
                                <h3>Оплата та доставка</h3>
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </div>
            {type=='settings'?<Settings/>:type=='payment'?<Payment/>:null}
        </div>
    )
}

export default Profile;