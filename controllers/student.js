/* eslint-env node */

import Student from '../models/Student';
import Announcement from '../models/Announcement';
import * as helper from '../helper';
import * as Constants from '../constant/index';

export const saveToken = async (req,res) => {
    try {
        var tokenFirebase = req.body.tokenFirebase;
        if (!tokenFirebase) throw new Error('no have token in params');

        await Student.findByIdAndUpdate(req.user._id, { $set: {token: tokenFirebase}}, { new: true });
        return res.json({success: true, message: 'ok'});
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        });
    }
};

export const getProfile = async (req,res) => {
    const student = await Student.findOne({
        _id : req.user._id
    })
        .populate({
            path :'courses' ,
            populate : {
                path : 'lecturers'
            }
        })
        .populate('class');
    res.json(helper.renameKeys(student._doc,{class : 'myClass'}));
};

export const removeReaction = async (req,res) => {
    try {
        const {_id,code} = req.body;
        const user = req.user;

        await Announcement.update({ _id }, {
            $pullAll: { [`reaction.${[Constants.REACTION[code.toString()]]}`] : user._id}
        });

        res.jsonp({
            success: true,
            message: 'Post reaction successfully!'
        });

    }catch (err) {
        res.status(500).jsonp({
            success: false,
            message: 'Remove reaction failure!'
        });
    }
};
export const postReaction = async (req,res) => {
    try {
        const {_id,code} = req.body;
        const user = req.user;

        await Announcement.update({ _id }, {
            $addToSet: { [`reaction.${[Constants.REACTION[code.toString()]]}`] : user._id}
        });

        res.jsonp({
            success: true,
            message: 'Post reaction successfully!'
        });

    }catch (err) {
        res.status(500).jsonp({
            success: false,
            message: 'Post reaction failure!'
        });
    }

};