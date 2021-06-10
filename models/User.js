const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    favorites: [{type: Types.ObjectId, ref: 'Product'}],
    products: [{type: Types.ObjectId, ref: 'Product'}],
    is_admin: {type: Boolean}
});

module.exports = model('User', schema);