const mongoose = require('mongoose');

// —————————————————————————————————————————————————————————————————————————————
// Category Schema
// —————————————————————————————————————————————————————————————————————————————

const categoryschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true});

module.exports = mongoose.model('category', categoryschema);