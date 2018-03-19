var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import _ from 'lodash';
const FeedbackSchema = Schema({
    announcementId:{
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: 'Announcement'
    },
    kindSender: {
        type: String,
        enum: ['Admin', 'Faculty', 'Department', 'Lecturer', 'Student'],
        require: true
    },
    content: {
        type: String,
        require: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'kindSender'
    },
    subFeedback: {
        type: mongoose.Schema.ObjectId,
        ref: 'Feedback'
    }

}, {
    timestamps: true
});

FeedbackSchema.statics.findByAnnouncementId= function (announcementId) {
    return this.find({
        announcementId
    }).populate([
        { path:'sender'}
    ]);
};

module.exports = mongoose.model('Feedback', FeedbackSchema);