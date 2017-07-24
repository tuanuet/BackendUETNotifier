/**
 * Created by Tuan on 18/01/2017.
 */
/* eslint-env node */
var mongoose = require('mongoose');

var LoaiTinTuc = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    }
},{
    timestamps : true
})

module.exports = mongoose.model('KindOfNews', LoaiTinTuc);
