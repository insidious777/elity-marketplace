import React from 'react';
import s from './Card.module.css';
import {Link} from 'react-router-dom';
import config from '../../config/config.js';
import locationIcon from '../../assets/img/combined-shape_2.png';
import typeIcon from '../../assets/img/combined-shape_3.png';
import timeIcon from '../../assets/img/combined-shape_4.png';
function Card(props){
    const item = props.item;
    const location = item.location;
    const linkUrl = `/product/${props.item._id}`;
    return(
        <Link to={linkUrl} style={props.style?props.style:null} className={s.Card}>
            <img alt="img" className={s.mainImg} src={item?config.baseUrl + item.photo_ids[0]:null}/>
            <div className={s.cardContent}>
                <div className={s.left}>
                    <h5>{item?item.title:null}</h5>
                    <p href="/"></p>
                    <p>{item?item.description:null}</p>
                    <div className={s.descContent}>
                        <div className={s.type}>
                            <img alt="img" className={s.icon} src={typeIcon}/>
                        <p>{item?item.category:null}</p>
                        </div>
                        <div className={s.time}>
                            <img alt="img" className={s.icon} src={timeIcon}/>
                            <p>{item?new Date(item.timestamp).toLocaleDateString('ua-UA'):null}</p>
                        </div>
                        <div className={s.location}>
                            <img alt="img" className={s.icon} src={locationIcon}/>
                            <p>{item?item.region:null}</p>
                        </div>
                    </div>
                </div>
                <div className={s.right}>
                    <div className={s.saveBtn}><i className="far fa-star"></i><p>Зберегти</p></div>
                    <h4>Ціна:</h4>
                    <p>{item?item.price:null} грн</p>
                </div>
            </div>
        </Link>
    )
}

export default Card;