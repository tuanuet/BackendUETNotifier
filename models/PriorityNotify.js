/* eslint-env node */
var mongoose= require('mongoose');
var MucDoThongBaoSchema = new mongoose.Schema({
    code : {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required : true
    }
},{
    timestamps : true
});


module.exports = mongoose.model('PriorityNotify',MucDoThongBaoSchema);