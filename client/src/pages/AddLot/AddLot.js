import React, {useState, useContext, useEffect} from 'react';
import PreviewItem from '../../components/PreviewItem/PreviewItem';
import CustomSelect from '../../components/CustomSelect/CustomSelect';
import s from './AddLot.module.css';
import {useHistory} from 'react-router-dom';
import {useHttp} from '../../hooks/HttpHook.js';
import config from '../../config/config.js';
import { FileDrop } from 'react-file-drop'
import { AuthContext } from '../../context/AuthContext';
import InputMask from 'react-input-mask';
import Loading from '../../components/Loading/Loading'
import jwt from "jwt-decode";
function AddProduct(){
    const history = useHistory();
    const {request, requestErrors} = useHttp();
    const [form, setForm] = useState({});
    const [lotType, setLotType] = useState('fixed');
    const [auctionType, setAuctionType] = useState('PROGRESSIVE');
    const [previewImages, setPreviewImages] = useState([]);
    const [photoIds, setPhotoIds] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [successShown, setSuccessShown] = useState(false);
    const [errorShown, setErrorShown] = useState(false);


    const submitHandler = async () => {
        let data;
        try{
            data = await request(config.baseUrl + '/api/products/add', 'POST',
            {...form, photo_ids:photoIds});
            if(data && data.productId) {
                setSuccessShown(true);
            }
        }catch(e){
            console.log(e);
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    
    const deletePhotosHandler = (id) => {
        let oldIds = [...photoIds];
        oldIds.splice(id, 1);
        setPhotoIds(oldIds);

        let oldPreviews = [...previewImages];
        oldPreviews.splice(id, 1);
        setPreviewImages(oldPreviews);
   }

    const photosHandler = async (files) => {
        const images = await fileListToBase64(files);
        let promises = [];
        let ids = [];
        let preview = [];
        images.map((image) => {
            if (!previewImages.some((el) => el.encoded_file === image.encoded_file)) {
                const promise = request(config.baseUrl + '/api/files/add', 'POST', image);
                promise.then((data) => {
                    ids.push(data._id);
                    preview.push(image);
                })
                promises.push(promise);
            }
        })
        Promise.all(promises).then(() => {
            setPhotoIds([...photoIds, ...ids]);
            setPreviewImages([...previewImages, ...preview]);
        })
    }
        
    const formChangeHandler = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
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

      useEffect(async ()=>{
          const user = await jwt(JSON.parse(localStorage.getItem('userData')).token);
          let data;
          try{
              data = await request(config.baseUrl + `/api/auth/user/${user.userId}`);
              console.log(data);
              if(data && data.info && data.info.phone_number) {
                  console.log('good');
              }else{
                  setErrorShown(true);
              }
          }catch(e){
              console.log(e);
          }
      },[])

    return(
        <div className={s.AddLot}>
            <div className={s.content}>
                <div className={s.title}>
                    <h1>Нове оголошення</h1>
                </div>

                <div className={s.lotInfo}>
                    <h2>Загальна інформація</h2>
                    <div className={s.colons}>
                        <div className={s.colonItem}>
                            <div className={s.infoBox}>
                                <label>Назва</label>
                                <input onChange={formChangeHandler} name="title"/>
                            </div>
                            <div className={s.infoBox}>
                                <label>Ціна (грн)</label>
                                <input onChange={formChangeHandler} name="price" type="number" placeholder="5000"/>
                            </div>
                        </div>
                        
                        <div className={s.colonItem}>
                            <div className={s.infoBox}>
                                <label>Категорія</label>
                                <CustomSelect name="category" onSelect={(id)=>{setForm({...form, category_id: id})}} url="/api/categories/"/>
                            </div>

                        </div>
                    </div>
                    <div className={s.description}>
                        <label>Опис товару</label>
                        <textarea onChange={formChangeHandler} name="description" placeholder="Опишіть ваш товар у деталях..."/>
                    </div>
                </div>

                <div className={s.location}>
                    <h2>Локація</h2>
                    <div className={s.infoBox}>
                        <label>Область</label>
                        <CustomSelect name="region" onSelect={(id)=>{setForm({...form, region_id: id})}} url="/api/regions/"/>
                    </div>
                </div>

                 <div className={s.photos}>
                    <h2>Фото товару</h2>
                    <p>Доступні формати: .jpg, .jpeg, .tiff, .png . Максимальний розмір файлу не повинен перевищувати 10 Mb.</p>
                    <FileDrop onDrop={photosHandler} className={s.dropBox} name="document">
                        <div>
                            <h3>Перетягніть фото та файли сюди або вкажіть шлях до них на вашому комп’ютері</h3>
                            <input onChange={(e)=>photosHandler(e.target.files)} type="file" multiple accept=".jpg, .jpeg, .tiff, .png, .pdf, .doc, .docx"/>
                            <button onClick={(e)=>{e.target.parentElement.children[1].click()}}>Обрати файл</button>
                        </div>
                    </FileDrop>
                    <div className={s.photosItems}>
                        {previewImages.map((item, i)=>{
                            return <PreviewItem onDelete={deletePhotosHandler} id={i}  key={item.encoded_file} item={item}/>
                        })}
                    </div>
                </div> 

                <div className={s.bottomBox}>
                    <div className={s.bottomBoxContent}>
                        <button onClick={submitHandler}>Завершити</button>
                        {isLoading?<Loading/>:null}
                        {successShown?
                        <div className={s.success}>
                            <div className={s.successContent}>
                                <h2>Оголошення було успішно створенно</h2>
                                <button onClick={()=>{history.push(`/`)}}>Готово</button>
                            </div>
                        </div>:null}
                        {errorShown?
                            <div className={s.success}>
                                <div className={s.successContent}>
                                    <h2>Відсутні данні про користувача</h2>
                                    <button onClick={()=>{history.push(`/profile/settings`)}}>Налаштування</button>
                                </div>
                            </div>:null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct;
