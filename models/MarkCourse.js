/* eslint-env node */
var mongoose = require('mongoose');

var DiemMonHocSchema = mongoose.Schema({

    midScore: {
        type: Number,
        required: true
    },
    finalScore: {
        type: Number,
        required: true
    },
    student: {
        type: String,
        ref: 'Student',
        required: true
    },
    course: {
        type: String,
        ref: 'Course',
        required: true
    },
    link: {
        type: String
    }

});

DiemMonHocSchema.statics.findJoinAll = (params) => {
    return DiemMonHocSchema.find(params).populate([
        {
            path: 'student',
            populate: {
                path: 'mainClass',
                populate: {path: 'faculty'}
            }
        },
        {
            path: 'course',
            populate: {path: 'lecturer'}
        }
    ]);

};

module.exports = mongoose.model('MarkCourse', DiemMonHocSchema);

