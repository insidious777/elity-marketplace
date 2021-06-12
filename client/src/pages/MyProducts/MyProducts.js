import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import s from './MyProducts.module.css';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import InputMask from 'react-input-mask';
import {useHttp} from '../../hooks/HttpHook';
import config from '../../config/config.js';
import Card from "../../components/Card/Card";
import jwt from "jwt-decode";
function MyProducts(){
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const {request, errors, msg} = useHttp();

    useEffect(async ()=>{
        const userData = localStorage.getItem('userData')?jwt(JSON.parse(localStorage.getItem('userData')).token):null;
        let data;
        try{
            data = await request(config.baseUrl + `/api/auth/user/${userData.userId}`);
            if(data && data.products) setProducts(data.products);
            console.log(data);
        }catch (e) {
            console.log(e);
        }

    },[]);

    return(
        <div className={s.MyProducts}>
            <div className={s.background}>
            </div >
            <div className={s.logForm}>
                <form>
                    <h1>Мої оголошення</h1>
                    <h2>Активні</h2>
                    {products?products.map((item, i)=>{
                        if(item.status=='active') return <Card style={{width:'100%'}} item={item} key={i}/>
                    }):null}
                    <h2>Продані</h2>
                    {products?products.map((item, i)=>{
                        if(item.status=='sold') return <Card style={{width:'100%'}} item={item} key={i}/>
                    }):null}
                </form>
            </div>
        </div>
    )
}

export default MyProducts;