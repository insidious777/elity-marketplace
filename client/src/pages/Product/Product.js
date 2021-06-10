import React, {useEffect, useState} from 'react';
import s from './Product.module.css';
import locationIcon from '../../assets/img/combined-shape_2.png';
import typeIcon from '../../assets/img/combined-shape_3.png';
import timeIcon from '../../assets/img/combined-shape_4.png';
import {useHttp} from '../../hooks/HttpHook';
import {useParams} from 'react-router-dom';
import config from '../../config/config.js';
import Loading from "../../components/Loading/Loading";
import {Link} from "react-router-dom";

function Product(){
    let id = useParams().params;
    const {request, loading} = useHttp();
    const [land, setLand] = useState({});
    const [cartExists, setCartExists] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [zoomPhotoShown, setZoomPhotoShown] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);

    const nextPhotoHandler = (e) => {
        if(currentImg<photos.length-1) setCurrentImg(currentImg+1);
    }

    const prevPhotoHandler = (e) => {
        if(currentImg>0) setCurrentImg(currentImg-1);
    }

    async function getData(){
        let data;
        try{ 
            data = await request(config.baseUrl + `/api/products/single/${id}`,'GET');
        }catch(e){
            console.log(e);
        }
        if(data){
            setLand(data);
            setPhotos(data.photo_ids)
        }
        
    }

    const cartDeleteHandler = () => {
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.map((el,elId)=>{
            console.log(el);
            console.log(id);
            if(el._id === id) {
                cart.splice(elId, 1);
                console.log('found')
            }

        })
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartExists(false);
    }

    const cartHandler = () => {
        const cartString = localStorage.getItem('cart');
        if(cartString) {
            const cart = JSON.parse(cartString);
            localStorage.setItem('cart', JSON.stringify([...cart, land]));
        }else localStorage.setItem('cart', JSON.stringify([land]));
        setCartExists(true);
    }


    const addComment = async () => {
        let data;
        try{
            data = await request(config.baseUrl + `/api/products/review/add/${id}`, 'POST', {content:'testContent'});
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        getData();
        const cartString = localStorage.getItem('cart');
        if(cartString) {
            const cart = JSON.parse(cartString);
            cart.map((el)=>{
                if(el._id===id) setCartExists(true);
            })
        }

    },[]);
    return(
        <div className={s.Lot}>
            {loading?<Loading/>:null}
            <div className={s.content}>
            {zoomPhotoShown?
            <div onClick={()=>{setZoomPhotoShown(false)}} className={s.zoomPhoto}>
                <div className={s.zoomPhotoContent}>
                    <img src={config.baseUrl + '' + photos[currentImg]}/>
                </div>
            </div>:null}
                <div className={s.topText}>
                    <h3>Оголошення / {land?land.category:null}</h3>
                    <p>Переглянуто раз: {land?land.views_count:null}</p>
                </div>

                <div className={s.lotContent}>
                    <div className={s.leftCol}>
                        <div className={s.mainPhoto}>
                        <div onClick={prevPhotoHandler} className={s.leftArr}>
                            <i className="fas fa-chevron-left"></i>
                        </div>
                        <div onClick={nextPhotoHandler} className={s.rightArr}>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                            <img onClick={()=>{setZoomPhotoShown(true)}} alt="img" src={config.baseUrl + '' + photos[currentImg]}/>
                        </div>
                            <div className={s.otherPhotos}>
                                {photos?photos.map((photo_url, i)=>{
                                    return <img 
                                    onClick={(e)=>{setCurrentImg(+e.target.id)}} 
                                    key={i} 
                                    id={i} 
                                    src={config.baseUrl + '' + photo_url}/>
                                }):null}
                            </div>
                    </div>
                    <div className={s.rightCol}>
                        <div className={s.priceBox}>
                            <div className={s.priceBoxInfo}>
                            <div>
                                <h2>{land?land.price:null} грн.</h2>
                                {/*<p>{land?land.price:null} га</p>*/}
                                <a href="/">{land.cadastral_number}</a>
                            </div>
                            </div>
                            <div className={s.priceBoxButtons}>
                                <button onClick={addComment}>Купити</button>
                                {cartExists?<button className={s.cartDeleteButton} onClick={cartDeleteHandler}>Видалити з збереженого</button>:<button onClick={cartHandler}>Зберегти</button>}
                            </div>
                        </div>
                        <div className={s.infoBox}>
                            <div>
                                <div className={s.type}>
                                    <img alt="img" className={s.icon} src={typeIcon}/>
                                    <p>{land?land.category:null}</p>
                                </div>
                                <div className={s.time}>
                                    <img alt="img" className={s.icon} src={timeIcon}/>
                                    <p>{land?new Date(land.timestamp).toLocaleDateString('ua-UA'):null}</p>
                                </div>
                                <div className={s.location}>
                                    <img alt="img" className={s.icon} src={locationIcon}/>
                                    <p>{land?land.region:null}</p>
                                </div>
                            </div>
                            <div className={s.lotOwner}>
                                <img alt="img" src="https://icons-for-free.com/iconfiles/png/512/business+costume+male+man+office+user+icon-1320196264882354682.png"/>
                                <div>
                                    <h3>{land && land.user?land.user.name:null}</h3>
                                    <p>{land && land.user?land.user.email:null}</p>
                                </div>
                            </div>
                        </div>
                        <div className={s.decriptionBox}>
                            <p>{land.description}</p>
                        </div>
                    </div>
                </div>
                <h1>Інші оголошення автора:</h1>
                <div className={s.otherProducts}>
                    {land && land.user? land.user.other_products.slice(0,4).map((el)=>{
                        if(el._id!==id)
                            return <a href={config.baseUrl + `/product/${el._id}`}>
                                <img src={config.baseUrl + el.photo_ids[0]}/>
                            </a>
                    }) :null}
                </div>
            </div>
        </div>
    )
}

export default Product;