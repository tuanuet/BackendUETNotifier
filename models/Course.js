/* eslint-env node */
var mongoose = require('mongoose');

var LopMonHocSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    term : {
        type: mongoose.Schema.ObjectId,
        ref : 'Term'
    },
    lecturers : [{
        type: mongoose.Schema.ObjectId,
        ref :'Lecturer'
    }],
    major :{
        type: mongoose.Schema.ObjectId
    }
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