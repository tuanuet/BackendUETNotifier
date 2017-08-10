/**
 * Created by Tuan on 18/01/2017.
 */
/* eslint-env node */
var mongoose = require('mongoose');

var LoaiTinTuc = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true,
        unique: true
    }
},{
    timestamps : true
});

module.exports = mongoose.model('KindOfNews', LoaiTinTuc);
