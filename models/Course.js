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
    term: {
        type: mongoose.Schema.ObjectId,
        ref: 'Term'
    },
    lecturers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Lecturer'
    }],
    sizeClass: {
        type: Number
    },
    major: {
        type: mongoose.Schema.ObjectId
    }
}, {timestamps: true});

LopMonHocSchema.methods.findJoinAll = (params) => {
    return LopMonHocSchema.find(params).populate([
        {
            path: 'term'
        },
        {
            path: 'lecturer',
            populate: {
                path: 'faculty'
            }
        }
    ]);
};

LopMonHocSchema.statics.getCoursesByIdLecturer = function (idLecturer) {
    return this.find({
        lecturers: idLecturer
    });
};

LopMonHocSchema.statics.updateLecturerById = function (_id, idLecturer, isPush) {

    if (isPush == 'true') {
        return this.update(
            {_id},
            {$push: {lecturers: idLecturer}},
        );
    } else if (isPush == 'false'){
        return this.update(
            {_id},
            {$pull: {lecturers: idLecturer}},
        );
    }

};


module.exports = mongoose.model('Course', LopMonHocSchema);