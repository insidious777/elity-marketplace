import React, {useState, useEffect} from 'react';
import s from './CustomSelect.module.css';
import {useHttp} from '../../hooks/HttpHook';
import config from '../../config/config.js';



function CustomSelect(props){
    const [optionsList, setOptionsList] = useState([]);
    const [guessList, setGuessList] = useState([]);
    const [selected, setSelected] = useState(false);
    const [listShown, setListShown] = useState(false);
    const {request} = useHttp();

    const getOptions = async () => {
        let data;
        try{
            data = await request(config.baseUrl + props.url, 'GET');
        }catch(e){
            console.log(e);
        }
        return data;
    }

    const itemClickHandler = (e) => {
        const text = e.target.childNodes[0].data || e.target.childNodes[0].childNodes[0].data;
        let input;
        if(e.target.parentNode.parentNode.childNodes[0].name==='input') 
        input = e.target.parentNode.parentNode.childNodes[0];
        else input = e.target.parentNode.parentNode.parentNode.childNodes[0];
        input.value = text;
        setListShown(false);
    }

    const blurHandler = async (e) => {
        setTimeout(()=>{
            checkSelected(e.target.value);
            setListShown(false);
        },100)
        if(!selected) e.target.value = '';
    }

    const checkSelected = (text) =>{
            setSelected(false);
            optionsList.map((option)=>{
                if(option.description === text || option.name === text) {
                    props.onSelect(option.id);
                    setSelected(true);
                }
            })  
    }

    const changeHandler = (e) => {
        setGuessList([]);
        let text = e.target.value;
        let arr = [];
        optionsList.map((el)=>{
            let name = el.name || el.description;
            if(name.toLowerCase().includes(text.toLowerCase())) {
                arr.push(name)
            }
        })
        setGuessList(arr);
    }

    useEffect( async ()=>{
        const options = await getOptions();
        setOptionsList(options);
    },[])

    
    return(
        <div className={s.CustomSelect}>
            <input
            placeholder={props.placeholder} 
            name="input" 
            spellCheck="false" 
            onClick={(e)=>{e.target.value='';changeHandler(e); setSelected(false);setListShown(true)}}
            onBlur={blurHandler} 
            onChange={changeHandler}  
            onFocus={()=>{setListShown(true)}}/>
            {listShown?<div className={s.optionsList}>
                {guessList.map((el, i)=>{
                    return  <div key={i} onClick={itemClickHandler} className={s.optionsItem}>
                                <p>{el}</p>
                            </div>
                })}
            </div>:null}
        </div>
    )
}

export default CustomSelect;