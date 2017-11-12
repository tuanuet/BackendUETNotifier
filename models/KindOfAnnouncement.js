/**
 * Created by Tuan on 18/01/2017.
 */
/* eslint-env node */
var mongoose = require('mongoose');

var KindOfAnnoucement = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
},{
    timestamps : true
});

module.exports = mongoose.model('KindOfAnnouncement', KindOfAnnoucement);
