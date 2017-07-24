/* eslint-env node */
var mongoose = require('mongoose');

var FileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link:{
        type: String,
        required:true
    }
},{
    timestamps : true
})

module.exports = mongoose.model('File',FileSchema);

