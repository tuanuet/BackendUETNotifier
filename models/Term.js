/* eslint-env node */
var mongoose = require('mongoose');

var KiHocSchema = mongoose.Schema({
    id:{
        type:mongoose.Schema.ObjectId,
        required: true,
        unique: true,
        default: mongoose.Types.ObjectId()
    },
    name: {
        type: String,
        required: true
    }

},{
    timestamps : true
})

module.exports = mongoose.model('Term',KiHocSchema);

