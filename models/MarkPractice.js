/* eslint-env node */
var mongoose = require('mongoose');

var DiemRenLuyenSchema = mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    student:{
        type: String,
        required : true,
        ref : 'Student'
    },
    term :{
        type: String,
        ref : 'Term'
    }
});

DiemRenLuyenSchema.methods.find = (params) => {
    return DiemRenLuyenSchema.find(params).populate([
        { path:'term' },
        { path:'student'}
    ]);
};

module.exports = mongoose.model('MarkPractice',DiemRenLuyenSchema);

