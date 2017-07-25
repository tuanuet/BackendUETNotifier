/* eslint-env node */
var mongoose   = require('mongoose');

var MajorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},{
    timestamps : true
});

module.exports = mongoose.model('Major',MajorSchema);

