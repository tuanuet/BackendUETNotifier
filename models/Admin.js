/* eslint-env node */
var mongoose = require('mongoose');

var AdminSchema = mongoose.Schema({
    _id:{
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        unique:true,
        required:true,
        index:true
    },
    name:{
        type:String,
        required: true
    }
},{
    timestamps : true
});

module.exports = mongoose.model('Admin',AdminSchema);


