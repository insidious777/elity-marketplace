import React, {useContext, useState, useEffect} from 'react';
import s from './Profile.module.css';
import {NavLink, useHistory} from "react-router-dom";
import defaultPhoto from '../../assets/img/logo.png'
import config from "../../config/config";
import {useHttp} from '../../hooks/HttpHook';
import {AuthContext} from "../../context/AuthContext";
import jwt from "jwt-decode";

function Profile() {
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [form, setForm] = useState({});
    const [photo, setPhoto] = useState();
    const [errorShown, setErrorShown] = useState(false);
    const history = useHistory();
    const changeHandler = (e) => {
        console.log(e.target.value)
        console.log(e.target.name)
        setForm({...form, [e.target.name]: e.target.value})
    }

    const submitHandler = async (e) => {
        console.log(form);
        if(form.apartment && form.card_lastname &&
            form.card_name && form.card_number &&
            form.city && form.email && form.name &&
            form.phone_number && form.street){
            let data;
            try{
                data = await request(config.baseUrl + '/api/auth/user/info', 'POST', form);
                history.push(`/`)
            }catch(e){
                console.log(e.errors);
            }
        }else {
            setErrorShown(true);
        }
    }

    async function fileListToBase64(fileList) {
        function getBase64(file) {
            const reader = new FileReader()
            const fileExtension = file.name.split('.').pop();
            const fileName = file.name.split('.')[0];
            return new Promise(resolve => {
                reader.onload = ev => {
                    resolve({
                        "file_extension": fileExtension,
                        "encoded_file": ev.target.result,
                        "filename": fileName,
                        "is_main_picture": false
                    })
                }
                reader.readAsDataURL(file)
            })
        }
        const promises = []
        for (let i = 0; i < fileList.length; i++) {
            promises.push(getBase64(fileList[i]))
        }
        return await Promise.all(promises)
    }

    const photosHandler = async (file) => {
        const base64img = await fileListToBase64(file);
        console.log(base64img[0].encoded_file);
        setPhoto(base64img[0].encoded_file);
        let data;
        try{
            data = await request(config.baseUrl + '/api/files/add', 'POST', base64img[0]);
            if(data && data.url){
                try{
                    const token = await request(config.baseUrl + '/api/auth/user/photo', 'POST', {url: data.url});
                    if(token && token.token) auth.login(token.token);
                }catch(e){
                    console.log(e.errors);
                }
            }
        }catch(e){
            console.log(e.errors);
        }
    }

    useEffect(()=>{
        if(localStorage.getItem('userData')){
            const token = jwt(JSON.parse(localStorage.getItem('userData')).token);
            setPhoto(config.baseUrl + '' + token.photo);
        }

    })
    return(
        <div className={s.Cabinet}>
            <div className={s.profileContent}>
                <h3>Користувач</h3>
                <label>Фото</label>
                <div className={s.photoChangeBox}>
                    <img src={photo || defaultPhoto}/>
                    <input onChange={(e)=>photosHandler(e.target.files)} accept=".jpg, .jpeg, .tiff, .png" type="file" />
                    <button onClick={(e)=>{e.target.parentElement.children[1].click()}}>Змінити фото</button>

                </div>
                <label>Ім'я</label>
                <input onBlur={changeHandler} name="name" placeholder="Андрій"/>
                <label>Номер телефону</label>
                <input onChange={changeHandler} name="phone_number"/>
                <label>Email</label>
                <input onChange={changeHandler} name="email" placeholder="mail@mail.ua" type="email"/>
                <h3 style={{marginTop:'20px'}}>Реквізити для оплати</h3>
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
                {errorShown?
                    <div className={s.success}>
                        <div className={s.successContent}>
                            <h2>Заповніть всі поля</h2>
                            <button className={s.saveButton} onClick={()=>{setErrorShown(false)}}>Зрозумліло</button>
                        </div>
                    </div>:null}
            </div>
        </div>
    )
}

export default Profile;