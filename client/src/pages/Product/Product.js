import React, {useEffect, useState, useRef, Fragment} from 'react';
import s from './Product.module.css';
import locationIcon from '../../assets/img/combined-shape_2.png';
import typeIcon from '../../assets/img/combined-shape_3.png';
import timeIcon from '../../assets/img/combined-shape_4.png';
import {useHttp} from '../../hooks/HttpHook';
import {useParams} from 'react-router-dom';
import config from '../../config/config.js';
import {useHistory} from 'react-router-dom';
import Loading from "../../components/Loading/Loading";
import GliderComponent from 'react-glider-carousel';
import '../../assets/js/glider.js';
import '../../assets/styles/glider.css';



function Product(){
    const dataRef = useRef();
    const signatureRef = useRef();
    const formRef = useRef();
    const areaRef = useRef();
    const history = useHistory();


    let id = useParams().params;
    const [otherProductsShown, setOtherProductsShown] = useState(true);
    const [productId, setProductId] = useState(id);
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
            data = await request(config.baseUrl + `/api/products/single/${productId}`,'GET');
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
            if(el._id === productId) {
                cart.splice(elId, 1);
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
    const renderSlider = () => {
        return(
            <GliderComponent key='uniqueKey' settings={{slidesToShow:3}} hasArrows="true">
                {land && land.user?land.user.other_products.map((el)=>{
                    if(el._id!==productId)
                        return <div key={el._id} className={s.otherProductsCart}>
                            <img src={config.baseUrl + el.photo_ids[0]}/>
                            <div>
                                <h3>{el.title}</h3>
                                <h3>{el.price} грн</h3>
                            </div>
                            <button onClick={()=>{setOtherProductsShown(false);setProductId(el._id)}}>Перейти до оголошення</button>
                        </div>
                }):null}
            </GliderComponent>
        )
    }

    async function generatePaynametData(price, description){
            async function sha1(str) {
                const buf = Uint8Array.from(unescape(encodeURIComponent(str)), c=>c.charCodeAt(0)).buffer;
                const digest = await crypto.subtle.digest('SHA-1', buf);
                const raw = String.fromCharCode.apply(null, new Uint8Array(digest));
                return btoa(raw); // base64
            }
            try{
                const privateKey = 'sandbox_TpYq0ya7uM6bf7G9TbdKznBpXunorwoAz6zxmlg2';
                const publicKey = 'sandbox_i94658168608';
                //{"public_key":"sandbox_i94658168608","version":"3","action":"pay","amount":"100","currency":"UAH","description":"test","order_id":"000001"}
                const json = `{"public_key":"${publicKey}","version":"3","action":"pay","amount":"${price}","currency":"UAH","description":"${description}","order_id":"${Math.floor(Math.random()*999999)+''}","server_url":"http://45.90.33.206:5000/product/liqpay/","result_url":"http://45.90.33.206:3000/"}`;
                console.log(json);
                //const data = btoa(json);
                const data = window.btoa(unescape(encodeURIComponent(json)))
                const sign_string = privateKey+data+privateKey;

                const signature = await sha1(sign_string);
                console.log(data);
                console.log(signature);
                dataRef.current.value = data;
                signatureRef.current.value = signature;
            }catch (e) {
                console.log(e);
            }

        }


    const addComment = async () => {
        const text = areaRef.current.value;
        let data;
        try{
            data = await request(config.baseUrl + `/api/products/review/add/${productId}`, 'POST', {content:text});
        }catch(e){
            console.log(e);
        }
        areaRef.current.value='';
        getData();
    }

    const buyHandler = async () => {
        let data;
        try{
           // data = await request(config.baseUrl + `/api/products/buy/${productId}`);
        }catch(e){
            console.log(e);
        }
        await generatePaynametData(land.price ,land.title);
        //formRef.current.submit();
    }

    useEffect(()=>{
        getData();
        const cartString = localStorage.getItem('cart');
        if(cartString) {
            const cart = JSON.parse(cartString);
            cart.map((el)=>{
                if(el._id===productId) setCartExists(true);
            })
        }
        setOtherProductsShown(true);
    },[productId]);
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
                        {land && land.title?<h1>{land.title}</h1>:null}
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
                                <form ref={formRef} method="POST" action="https://www.liqpay.ua/api/3/checkout"
                                      accept-charset="utf-8">
                                    <input ref={dataRef} type="hidden" name="data"/>
                                    <input ref={signatureRef} type="hidden" name="signature"/>
                                </form>
                                {cartExists?<button className={s.cartDeleteButton} onClick={cartDeleteHandler}>Видалити з збереженого</button>:<button onClick={cartHandler}>Зберегти</button>}
                                {land.status=='active'?<button onClick={buyHandler}>Купити</button>:<h3>Товар продано</h3>}
                            </div>
                        </div>
                        <div className={s.infoBox}>
                            <div className={s.infoBoxTypes}>
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
                                {land && land.user?<img alt="img" src={config.baseUrl + land.user.picture}/>:null}
                                <div>
                                    <h3>{land && land.user?land.user.name:null}</h3>
                                    <p>{land && land.user?land.user.email:null}</p>
                                </div>
                            </div>
                        </div>
                        <div className={s.decriptionBox}>
                            <p>{land.description}</p>
                        </div>
                        <div className={s.coments}>
                            {land && land.reviews?land.reviews.map((el)=>{
                                return <div className={s.comentItem}>
                                    <div>
                                        <img src={config.baseUrl + '' + el.photo}/>
                                        <h2>{el.name}</h2>
                                    </div>
                                    <p>{el.content}</p>
                                </div>
                            }):null}
                        </div>
                        <div className={s.reviewBox}>
                            <h2>Додайте коментар до товару:</h2>
                            <textarea ref={areaRef}>

                            </textarea>
                            <button onClick={(e)=>{addComment(e)}}>Надіслати</button>
                        </div>
                    </div>
                </div>
                <h1 className={s.bottomTitle}>Інші оголошення автора:</h1>
                {land && land.user && otherProductsShown? renderSlider():null}


            </div>
        </div>
    )
}

export default Product;
