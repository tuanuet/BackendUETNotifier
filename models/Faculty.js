/* eslint-env node */
var mongoose   = require('mongoose');
// User of Major
var KhoaSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        required:true,
        index:true
    },
    name: {
        type: String,
        required: true
    },
    major :{
        type: mongoose.Schema.ObjectId
    }
},{
    timestamps : true
});

module.exports = mongoose.model('Faculty',KhoaSchema);

