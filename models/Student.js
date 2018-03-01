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
        type: String,
        ref :'Class'
    },
    courses:[{
        type: String,
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

//retrieve token by id
SinhVienSchema.statics.findTokenByIdClass = function (idClass) {
    return this.find({class : idClass}).select({
        token : 1
    });
};
SinhVienSchema.statics.findTokenByIdCourse = function (idCourse) {
    return this.find({class : idCourse}).select({
        token : 1
    });
};
SinhVienSchema.statics.findTokenByCode = function (code) {
    return this.find({code}).select({
        token : 1
    });
};

SinhVienSchema.statics.findByCourseId = function (idCourse) {
    return this
        .aggregate([
            {$match : { courses : { $in: [idCourse] }}},
            {$sort : {code : 1}},
            {
                $lookup: {
                    from: 'classes',
                    localField: 'class',
                    foreignField: '_id',
                    as: 'myClass'
                }
            },
            // Unwind the result arrays ( likely one or none )
            { $unwind: '$myClass' },
            {
                $project: {
                    class: 0,
                    courses: 0
                }
            }
        ])
        .allowDiskUse(true);

        // .populate('class')
        // .sort('code')
        // .select('-courses');
        //
};

module.exports = mongoose.model('Student',SinhVienSchema);

