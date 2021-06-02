const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    id: {type: Number}
});

module.exports = model('Region', schema);