/* eslint-env node */
var mongoose = require('mongoose');

var SinhVienSchema =new  mongoose.Schema({
    _id:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true,
        index :true
    },
    name: {
        type: String,
        required: true,
        index:true
    },
    class:{
        type: mongoose.Schema.ObjectId,
        ref :'Class'
    },
    courses:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    }],
    code :{
        type : String,
        index :true,
        required : true
    },
    token:{
        type: String
    }
},{
    timestamps : true
});


SinhVienSchema.statics.findOneJoinAll = function(params) {
    return(
        this
        .findOne(params)
        .populate([
            {
                path:'mainClass',
                populate:{path:'faculty'}
            },
            {
                path:'course',
                populate:{ path:'lecture'}
            },
            { path:'kindOfAnnouncement' },
            { path:'kindOfNew' }
        ])
    );
};

SinhVienSchema.statics.findStudentByClasses = function (idClasses) {
    return this.find({ class : { $in: idClasses}});
};
SinhVienSchema.statics.findStudentByCourses = function (idCourses) {
    return this.find({ courses : { $in: idCourses }});
};
SinhVienSchema.statics.findByArrayId = function (studentIds) {
    return this.find({ code: {$in : studentIds}});
};

module.exports = mongoose.model('Student',SinhVienSchema);

