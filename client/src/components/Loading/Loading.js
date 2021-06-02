import React from 'react';
import s from './Loading.module.css';
import loading from '../../assets/img/loading.svg'
function Loading(){
    return(
        <div className={s.loading}>
            <img src={loading}/>
        </div>
    )
}

export default Loading;