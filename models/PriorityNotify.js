/* eslint-env node */
var mongoose= require('mongoose');
var MucDoThongBaoSchema = new mongoose.Schema({

    id:{
        type: Number,
        unique: true
    },
    name :{
        type: String,
        required : true
    }
},{
    timestamps : true,
    _id : false
});


module.exports = mongoose.model('PriorityNotify',MucDoThongBaoSchema);