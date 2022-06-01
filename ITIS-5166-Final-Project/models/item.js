const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {type: String, required: [true, 'name of product is required']},
    manufacturer: {type: String, required: [true, 'manufacturer of product is required']},
    category: {type: String, required: [true, 'category of product is required']},
    description: {type: String, required: [true, 'description of product is required'], minlength: [10, 'the description should have at least 10 characters']},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    watchedBy: [{type: Schema.Types.ObjectId, ref: 'Watcher'}],
    availability: {type: Boolean, default: true}
},
{timeseries: true});

module.exports = mongoose.model('Item', itemSchema);