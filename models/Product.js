const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    title: {type: String, required: true},
    region_id: {type: Number, required: true},
    category_id: {type: Number, required: true},
    description: {type: String},
    photo_ids: [{type: String}],
    price: {type: Number},
    owner: {type: Types.ObjectId, ref:'User'},
    views_count: {type:Number},
    timestamp: {type:Number}
});

module.exports = model('Product', schema);