export default function localizate(error, languageCode){
    let localizatedError = '';
//======================UKRAINIAN====================================
    switch(languageCode){
        case 'UA':{
            switch(error.code){
                case 'authentication_failed':{
                    localizatedError = 'Невірний пароль';
                    break;
                }
                case 'invalid': {
                    switch(error.field){
                        case 'email': {
                            localizatedError = 'Невірно введено електронну адресу';
                            break;
                        }
                        case 'phone_number':{
                            localizatedError = 'Невірно введено номер телефону';
                            break;
                        }
                        case 'password':{
                            localizatedError = 'Невірно введено пароль';
                            break;
                        }
                        case 'cadastral_number':{
                            localizatedError = 'Невірно введено кадастровий номер';
                            break;
                        }
                    }
                    break;
                }
                case 'required': {
                    switch(error.field){
                        case 'email': {
                            localizatedError = 'Введіть електронну адресу';
                            break;
                        }
                        case 'phone_number':{
                            localizatedError = 'Введіть номер телефону';
                            break;
                        }
                        case 'password':{
                            localizatedError = 'Введіть пароль';
                            break;
                        }
                        case 'price':{
                            localizatedError = 'Введіть ціну';
                            break;
                        }
                        case 'cadastral_number':{
                            localizatedError = 'Введіть кадастровий номер';
                            break;
                        }
                        case 'purpose_id':{
                            localizatedError = 'Введіть призначення землі';
                            break;
                        }
                        case 'area':{
                            localizatedError = 'Введіть площу';
                            break;
                        }
                        case 'description':{
                            localizatedError = 'Введіть опис';
                            break;
                        }
                        case 'region_id':{
                            localizatedError = 'Введіть область';
                            break;
                        }
                        case 'district_id':{
                            localizatedError = 'Введіть район';
                            break;
                        }
                        case 'settlement_id':{
                            localizatedError = 'Введіть населенний пункт';
                            break;
                        }
                        case 'min_price':{
                            localizatedError = 'Введіть мінімальну ціну';
                            break;
                        }
                        case 'street_id':{
                            localizatedError = 'Введіть вулицю';
                            break;
                        }
                    }
                    break;
                }
                case 'empty': {
                    switch(error.field){
                        case 'document_ids':{
                            localizatedError = 'Оголошення повинно містити прийнаймі 1 документ';
                            break;
                        }
                        case 'photo_ids':{
                            localizatedError = 'Оголошення повинно містити прийнаймі 1 фото';
                            break;
                        }
                    }
                    break;
                }
                case 'password_too_short': {
                    localizatedError = 'Пароль надто короткий';
                    break;
                }
                
                case 'password_too_common': {
                    localizatedError = 'Пароль надто простий';
                    break;
                }
                default:{
                    localizatedError = 'Невідома помилка';
                    break;
                }
            }
            break;
        }
//======================RUSSIAN====================================
        case 'RU':{
            switch(error.code){
                case 'authentication_failed':{
                    localizatedError = 'Некоректный пароль';
                    break;
                }
                case 'invalid': {
                    switch(error.field){
                        case 'email': {
                            localizatedError = 'Некоректный електронный адрес';
                            break;
                        }
                        case 'phone_number':{
                            localizatedError = 'Некоректный номер телефона';
                            break;
                        }
                        case 'password':{
                            localizatedError = 'Некоректный пароль';
                            break;
                        }
                    }
                    break;
                }
                case 'required': {
                    switch(error.field){
                        case 'email': {
                            localizatedError = 'Введите електронный адрес';
                            break;
                        }
                        case 'phone_number':{
                            localizatedError = 'Введите номер телефона';
                            break;
                        }
                        case 'password':{
                            localizatedError = 'Введите пароль';
                            break;
                        }
                    }
                    break;
                }
                case 'password_too_short': {
                    localizatedError = 'Пароль слишком короткий';
                    break;
                }
                case 'password_too_common': {
                    localizatedError = 'Пароль слишком простой';
                    break;
                }
                default:{
                    localizatedError = 'Неизвесная ошибка';
                    break;
                }
            }
            break;
        }
//======================ENGLISH====================================
        case 'EN':{
            switch(error.code){
                case 'authentication_failed':{
                    localizatedError = 'Wrong password';
                    break;
                }
                case 'invalid': {
                    switch(error.field){
                        case 'email': {
                            localizatedError = 'Invalid email';
                            break;
                        }
                        case 'phone_number':{
                            localizatedError = 'Invalid phone number';
                            break;
                        }
                        case 'password':{
                            localizatedError = 'Invalid password';
                            break;
                        }
                    }
                    break;
                }
                case 'required': {
                    switch(error.field){
                        case 'email': {
                            localizatedError = 'Enter email';
                            break;
                        }
                        case 'phone_number':{
                            localizatedError = 'Enter phone number';
                            break;
                        }
                        case 'password':{
                            localizatedError = 'Enter password';
                            break;
                        }
                    }
                    break;
                }
                case 'password_too_short': {
                    localizatedError = 'Password too short';
                    break;
                }
                case 'password_too_common': {
                    localizatedError = 'Password too common';
                    break;
                }
                default:{
                    localizatedError = 'Undefined error';
                    break;
                }
            }
            break;
        }
    }
    return localizatedError;
}