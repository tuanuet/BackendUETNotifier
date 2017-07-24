/* eslint-env node */
var mongoose = require('mongoose');

var PhongBanSchema = mongoose.Schema({
    _id:{
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        unique: true,
        required:true,
        index:true
    },
    name:{
        type: String,
        required: true
    }

},{
    timestamps : true
})

PhongBanSchema.statics.update = (id, params) => {
    return PhongBanSchema.findByIdAndUpdate(id,params,{new: true});
};

module.exports = mongoose.model('Department',PhongBanSchema);