const {Schema, model} = require('mongoose');

const schema = new Schema({
    url: {type: String, required: true},
});

module.exports = model('File', schema);