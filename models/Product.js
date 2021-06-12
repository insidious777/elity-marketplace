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
    reviews: [{
        ownerId: {type: Types.ObjectId},
        content: {type: String},
        photo: {type: String},
        name: {type: String}
    }],
    status: {type:String},
    buyer: {type: Types.ObjectId},
    timestamp: {type:Number}
});

module.exports = model('Product', schema);