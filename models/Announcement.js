/* eslint-env node */
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
import { KINDOFRECEIVER } from '../constant';
var ThongBaoSchema = Schema({
    kindOfSender:{
        type: String,
        enum: ['Department','Faculty','Lecturer']
    },
    title:{
        type: String,
        required : true
    },
    content:{
        type: String,
        required: true
    },
    sender:{
        type: mongoose.Schema.ObjectId,
        refPath: 'kindOfSender',
        required: true
    },
    receiver:[{
        type: mongoose.Schema.ObjectId,
        refPath: 'kindOfReceiver',
    }],
    kindOfReceiver:{
        type: String,
        enum: KINDOFRECEIVER,
        require :true
    },
    file: {
        type: mongoose.Schema.ObjectId,
        ref: 'File'
    },
    kindOfAnnouncement:{
        type: mongoose.Schema.ObjectId,
        ref: 'KindOfAnnouncement',
        required: true
    },
    priorityNotify:{
        type: mongoose.Schema.ObjectId,
        ref:'PriorityNotify',
        required: true
    },
    link:{
        type: String,
        sparse: true
    },
    feedback:[
        {
            kindOfSenderFeedback:{
                type: Number,
                enum:['Admin','Faculty','Department','Lecturer','Student'],
                require: true
            },
            content :{
                type: String,
                require: true
            },
            senderFeedback:{
                type: Number,
                require: true,
                refPath: 'feedback.kindOfSenderFeedback'
            },
            time:{
                type: Date,
                default: Date.now
            }
        }
    ]
},{
    timestamps : true
});


ThongBaoSchema.statics.findJoinAll = function(params) {
    return this.find(params).populate([
        { path:'file' },
        { path:'kindOfAnnouncement' },
        { path: 'priorityNotify' },
        { path:'feedback.senderFeedback'},
        { path:'sender' },
        { path:'receiver'}
    ]);
};

ThongBaoSchema.statics.findOneJoinAll = function (params){
    return this.findOne(params).populate([
        { path:'file'  },
        { path: 'kindOfAnnouncement' },
        { path: 'priorityNotify' },
        { path:'feedback.senderFeedback'},
        { path:'sender' },
        { path:'receiver'}
    ]);
};

ThongBaoSchema.methods.getMessage = async function() {
    return mongoose.model('Announcement').findOneJoinAll({_id : this._id});
};
//no feedback
ThongBaoSchema.statics.findJoinAllLimitOffset = function(params,limit = 10,offset = 0) {
    return this
        .find(params)
        .limit(limit)
        .skip(offset)
        .populate([
            { path:'file'  },
            { path:'kindOfAnnouncement'},
            { path:'sender' },
            { path:'receiver'}
        ]);
};

module.exports = mongoose.model('Announcement',ThongBaoSchema);

