/* eslint-env node */
var mongoose = require('mongoose');

var KiHocSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }

},{
    timestamps : true
});

module.exports = mongoose.model('Term',KiHocSchema);

