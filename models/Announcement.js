/* eslint-env node */
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
import _ from 'lodash';
import { KINDOFRECEIVER } from '../constant';
const ThongBaoSchema = Schema({
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
    link:{
        type: String,
        sparse: true,
    },
    description:{
        type: String,
        sparse: true,
        require: true
    },
    sender:{
        type: mongoose.Schema.ObjectId,
        refPath: 'kindOfSender',
        required: true
    },
    receiver:[{
        type: String,
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
        type: String,
        ref: 'KindOfAnnouncement',
    },
    priorityNotify:{
        type: mongoose.Schema.ObjectId,
        ref:'PriorityNotify',
        required: true
    },
    descriptionImages:[{
        type: String,
    }],

    reaction:{
        angry:[{
            type: mongoose.Schema.ObjectId,
            ref:'Student'
        }],
        cry:[{
            type: mongoose.Schema.ObjectId,
            ref:'Student'
        }],
        love:[{
            type: mongoose.Schema.ObjectId,
            ref:'Student'
        }],
        wow:[{
            type: mongoose.Schema.ObjectId,
            ref:'Student'
        }],
        surprise:[{
            type: mongoose.Schema.ObjectId,
            ref:'Student'
        }]
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
        { path:'sender' },
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

ThongBaoSchema.statics.findByIdJoinAll = function(id) {
    return this
        .findById(id)
        .populate([
            {path : 'priorityNotify'},
            { path:'file'  },
            { path:'kindOfAnnouncement'},
            { path:'sender' },
            { path:'receiver'}
        ]);
};
ThongBaoSchema.statics.fetching = function (topics, lastTime= new Date()) {
    return this
        .aggregate([
            {
                $match : {
                    $and : [
                        {kindOfAnnouncement : { $in: topics }},
                        {createdAt : {$gte: lastTime}}
                    ]
                }
            },
            {$project: {_id : 1}},
            {$limit : 30}
        ])
        .allowDiskUse(true)
        .then(data => data.map(item => item._id));
};
ThongBaoSchema.statics.fetchReaction = function (ids,userId) {
    return this
        .aggregate([
            {$match: {_id: {$in: ids.map(el => mongoose.Types.ObjectId(el) )}}},
            {
                $project: {
                    angry: {
                        length: {$size: {$ifNull: ['$reaction.angry',[]]}},
                        isReact: {$in:[userId,{$ifNull: ['$reaction.angry',[]]}]}
                    },
                    cry:{
                        length: {$size: {$ifNull: ['$reaction.cry',[]]}},
                        isReact: {$in:[userId,{$ifNull: ['$reaction.cry',[]]}]}
                    },
                    love:{
                        length: {$size: {$ifNull: ['$reaction.love',[]]}},
                        isReact: {$in:[userId,{$ifNull: ['$reaction.love',[]]}]}
                    },
                    wow:{
                        length: {$size: {$ifNull: ['$reaction.wow',[]]}},
                        isReact: {$in:[userId,{$ifNull: ['$reaction.wow',[]]}]}
                    },
                    surprise:{
                        length: {$size: {$ifNull: ['$reaction.surprise',[]]}},
                        isReact: {$in:[userId,{$ifNull: ['$reaction.surprise',[]]}]}
                    },
                },
            },
        ])
        .allowDiskUse(true)
        .then(arrays => {
            return _.map(ids,id => {
                const index = _.findLastIndex(arrays,react => react._id == id);
                if(index < 0) return null;
                return arrays[index];
            });
        });
};
module.exports = mongoose.model('Announcement',ThongBaoSchema);

