import React from 'react';
import s from './Restore.module.css'
import {NavLink} from 'react-router-dom';
function Restore(){
    return(
        <div className={s.Restore}>
            <div className={s.background}>
            </div >

            <div className={s.resForm}>
                <form>
                    <h1>Забули пароль</h1>
                    <input placeholder="Номер телефону/Email"/>
                    <div className={s.butBox}>
                        <button>Надіслати</button>
                    </div>
                <div className={s.regBox}>
                    <p>Ще не зареєстровані?</p>
                    <NavLink to="/register">Зареєструватись</NavLink>
                </div>
                </form>
            </div>  
        </div>
    )
}

export default Restore;