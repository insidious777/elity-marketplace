import React from 'react';
import s from './PreviewItem.module.css';
import docIcon from '../../assets/img/document-icon.png'
function PreviewItem(props){
    return( 
        <div className={s.PreviewItem}>
            {props.item.encoded_file.split('/')[0]=="data:image"?
            <img className={s.image} src={props.item.encoded_file}/>:
            <div className={s.document}>
                <img src={docIcon}/>
            </div>}
            <div className={s.PreviewItemText}>
                <h5>{props.item.filename}</h5>
                <p className={s.deleteButton} onClick={()=>{props.onDelete(props.id)}}>Видалити</p>
            </div>
        </div>
    )
}

export default PreviewItem;