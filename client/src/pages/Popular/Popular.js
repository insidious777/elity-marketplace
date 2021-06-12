import React, {useState, useEffect, useRef} from 'react';
import s from './Popular.module.css';
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

function Popular(){
    const inputRef = useRef();
    const [products, setProducts] = useState(null);
    const [filter, setFilter] = useState({date:'new'});
    const [settlementShown, setSettlementShown] = useState(false);
    const [purposeShown, setPurposeShown] = useState(false);
    const [sidemenuShown, setSidemenuShown] = useState(false);
    const {request, loading} = useHttp();


    const resetFiltersHandler = async () => {
        setFilter({});
        inputRef.current.value='';
    }

    useEffect(()=>{
        async function getLots(){
            console.log('getData');
            const params = new URLSearchParams(filter);

            if(params) {
                console.log(true);
                const data = await request(config.baseUrl + `/api/products/popular?${params}`);
                if(data) setProducts(data);
            }else{
                console.log(false);
                const data = await request(config.baseUrl + '/api/products/popular');
                console.log(data);
                if(data) setProducts(data);
            }
        }
        getLots();
    },[filter])
    return(
        <div className={s.Auction}>
            {loading?<Loading/>:null}
            <div className={s.filter}>
                <div className={s.filterInput}>
                    <i className="fas fa-search"></i>
                    <input ref={inputRef} onChange={(e)=>{setFilter({...filter, search: e.target.value})}} placeholder="Введіть назву товару"/>
                </div>
                <label className={s.filtersButton} htmlFor={s.filterCheck}>
                    <p>Фільтри оголошень</p>
                    <i className="fas fa-filter"></i>
                </label>
                <div className={s.filterBottom}>
                    <div className={s.filterBottomLeft}>
                        <div className={s.filterBox}>
                            <div onClick={()=>{setPurposeShown(true)}} className={s.filterBoxContent}>
                                <p>Категорія</p>
                                {purposeShown?<i className="fas fa-chevron-up"></i>:<i className="fas fa-chevron-down"></i>}
                            </div>
                            {purposeShown?<OutsideClickHandler onOutsideClick={()=>{setPurposeShown(false)}}><div className={s.filterDropdown}>
                                <div className={s.infoBox}>
                                    <label>Категорія</label>
                                    <CustomSelect
                                        onSelect={(id)=>{setFilter({...filter, category_id: id})}}
                                        url="/api/categories/"/>
                                </div>
                            </div></OutsideClickHandler>:null}
                        </div>
                        <div className={s.filterBox}>
                            <div onClick={()=>{setSettlementShown(!settlementShown)}} className={s.filterBoxContent}>
                                <p>Розташування</p>
                                {settlementShown?<i className="fas fa-chevron-up"></i>:<i className="fas fa-chevron-down"></i>}
                            </div>
                            {settlementShown?<OutsideClickHandler onOutsideClick={()=>{setSettlementShown(false)}}><div className={s.filterDropdown}>
                                <div className={s.infoBox}>
                                    <label>Область</label>
                                    <CustomSelect
                                        onSelect={(id)=>{setFilter({...filter, region_id: id})}}
                                        url="/api/regions/"/>
                                </div>
                            </div></OutsideClickHandler>:null}
                        </div>
                    </div>
                    <button onClick={resetFiltersHandler} className={s.resetBtn}>Скинути фільтри</button>
                </div>
            </div>
            <div className={s.content}>
                {products?products.map((item, i)=>{
                    console.log(item);
                    return <Card item={item} key={i}/>
                }):null}
            </div>

        </div>
    )
}

export default Popular;