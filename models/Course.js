/* eslint-env node */
var mongoose = require('mongoose');

var LopMonHocSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    term : {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref : 'Term'
    },
    lecturer : [{
        type: Number,
        required : true,
        ref :'Lecturer'
    }]
},{timestamps : true});

LopMonHocSchema.methods.findJoinAll =  (params) => {
    return LopMonHocSchema.find(params).populate([
        {
            path:'term'
        },
        {
            path:'lecturer',
            populate:{
                path:'faculty'
            }
        }
    ]);
};


module.exports = mongoose.model('Course',LopMonHocSchema);