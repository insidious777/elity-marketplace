import React, {useState} from 'react';
import s from './Profile.module.css';
import {NavLink, useHistory} from "react-router-dom";
import defaultPhoto from '../../assets/img/logo.png'

function Profile() {
    const [type, setType] = useState('settings');

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
                <input placeholder="Андрій Андрієнко"/>
                <label>Номер телефону</label>
                <input/>
                <label>Email</label>
                <input placeholder="Андрій Андрієнко" type="email"/>
                <label>Пароль</label>
                <input placeholder="********" type="password"/>
                <label>Новий пароль</label>
                <input type="password"/>
                <button className={s.saveButton}>Зберегти</button>
            </div>
        )
    }

    function Payment() {
        return(
            <div className={s.profileContent}>
                <h3>Реквізити для оплати</h3>
                <label>Номер картки</label>
                <input placeholder="5268 4839 0485 2075"/>
                <label>Ім'я</label>
                <input placeholder="Олександр"/>
                <label>Фамілія</label>
                <input placeholder="Голубець"/>
                <h3 style={{marginTop:'20px'}}>Доставка</h3>
                <label>Місто</label>
                <input placeholder="Львів"/>
                <label>Вулиця</label>
                <input placeholder="Довженка"/>
                <label>Відділення Нової Пошти</label>
                <input placeholder="7" type="number"/>
                <button className={s.saveButton}>Зберегти</button>
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