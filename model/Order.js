var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var orderSchema = new Schema({
    name: String,
    address: String,
    tel: String,
    detail: Array,
    sum: Number,
    size: Number,
    createdOn: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', orderSchema);