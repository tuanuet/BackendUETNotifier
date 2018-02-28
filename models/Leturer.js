/* eslint-env node */
var mongoose = require('mongoose');

var LecturerSchema = mongoose.Schema({
    _id:{
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        required:true,
        index:true
    },
    name:{
        type:String,
        required: true
    }
},{
    timestamps : true
});

LecturerSchema.statics.findJoinAll = (params) => {
    return LecturerSchema.find(params);
};
LecturerSchema.statics.findOneJoinAll = (params) => {
    return LecturerSchema.findOne(params);
};
LecturerSchema.statics.findByCourseId = function (courseId) {
    return this.find({ courses : { $in: [courseId] }});
};
module.exports = mongoose.model('Lecturer',LecturerSchema);


