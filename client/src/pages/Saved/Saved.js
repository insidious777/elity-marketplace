import React, {useState, useEffect, useRef} from 'react';
import s from './Saved.module.css';
import dateFormat from 'dateformat';
import InputMask from 'react-input-mask';
import Card from '../../components/Card/Card'
import DatePicker from 'react-datepicker';
import CustomSelect from '../../components/CustomSelect/CustomSelect';
import OutsideClickHandler from 'react-outside-click-handler';
import config from '../../config/config.js';
import {useHttp} from '../../hooks/HttpHook';
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../../components/Loading/Loading";

function Saved(){
    const [products, setProducts] = useState(null);
    const [filterDate, setFilterDate] = useState(null);
    const [filter, setFilter] = useState({});
    const [settlementShown, setSettlementShown] = useState(false);
    const [purposeShown, setPurposeShown] = useState(false);
    const [sidemenuShown, setSidemenuShown] = useState(false);
    const {request, loading} = useHttp();

    const dateHandler = (date) =>{
        const formatedDate = dateFormat(date,"yyyy-mm-dd");
        setFilterDate(formatedDate);
        setFilter({...filter,date_start:formatedDate});
    }

    const numberChangeHandler = async (e) =>{
        setFilter({...filter,search:e.target.value});
    }

    const resetFiltersHandler = async () => {
        setFilter({});
        setFilterDate(null);
    }

    useEffect(()=>{
        const cart = localStorage.getItem('cart');
        if(cart) setProducts(JSON.parse(cart));
    },[])
    return(
        <div className={s.Auction}>
            {loading?<Loading/>:null}

            <div className={s.content}>
                {products?products.map((item, i)=>{
                    console.log(item);
                    return <Card item={item} key={i}/>
                }):null}
            </div>

        </div>
    )
}

export default Saved;