const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum : ["pending", "completed", "cancelled"],
        default: "pending"

    }
}, { timestamps : true})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;

