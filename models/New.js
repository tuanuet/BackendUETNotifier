/* eslint-env node */
import {NewNotification} from '../response';
import * as helper from '../helper';

var mongoose = require('mongoose');

//model crawl dũ liệu trên sevêr cũ
var TinTucSchema = new mongoose.Schema({
    link: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        require: true
    },
    imageLink: {
        type: String,
        require: true
    },
    postAt: {
        type: Date,
        require: true,
        default: Date.now()
    },
    tags: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true
});

TinTucSchema.methods.findLimitOffset = (param, offset, limit = 10) => {
    return TinTucSchema
        .find(param)
        .sort({'postAt': -1})
        .limit(limit)
        .skip(offset)
        .populate('kind');

};

TinTucSchema.methods.find = (param, limit = 10) => {
    return TinTucSchema
        .find(param)
        .limit(limit)
        .sort({'postAt': -1});
};

TinTucSchema.methods.getDataNotification = function () {
    return NewNotification({...{_id: this.id}, ...this._doc, ...{tags: helper.getTagsOfNews(this.tags)}});
};

TinTucSchema.statics.findByTagName = function (tagName) {
    return this.find({
        tags: {
            $in: [tagName]
        }
    })
        .sort({'postAt': -1});
};

TinTucSchema.statics.findTenNews = function () {
    return this.find({})
        .limit(10)
        .sort({'postAt': -1});
};

TinTucSchema.statics.fetching = function (topics, lastTime = new Date()) {
    return this
        .aggregate([
            {
                $match: {
                    $and: [
                        {tags: {$in: topics}},
                        {postAt: {$gte: lastTime}}
                    ]
                }
            },
            {$project: {_id: 1}},
        ]).allowDiskUse(true)
        .then(data => data.map(item => item._id));

};

module.exports = mongoose.model('New', TinTucSchema);