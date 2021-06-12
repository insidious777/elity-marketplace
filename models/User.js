const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    products: [{type: Types.ObjectId, ref: 'Product'}],
    photo: {type: String},
    info:{
        name: {type:String},
        phone_number: {type:String},
        email: {type:String},
        card_number: {type:String},
        card_name: {type:String},
        card_lastname: {type:String},
        city: {type:String},
        street: {type:String},
        apartment: {type:String},
    }
});

module.exports = model('User', schema);