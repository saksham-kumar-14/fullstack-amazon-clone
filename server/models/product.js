const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    pictureUrl: {
        type:String,
        required:true,
    },
    deliveryTime: {
        type:Number,
        required:true
    },
    specifications: {
        type: Array,
        required: true
    },
    temp: {
        type:Array,
        required: true
    }
});

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;