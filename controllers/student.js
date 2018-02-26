/* eslint-env node */

import Student from '../models/Student';
import * as helper from '../helper';

export const saveToken = async (req,res) => {
    try {
        var tokenFirebase = req.body.tokenFirebase;
        if (!tokenFirebase) throw new Error('no have token in params');

        await Student.findByIdAndUpdate(req.user._id, { $set: {token: tokenFirebase}}, { new: true })
        return res.json({success: true, message: 'ok'});
    } catch (err) {
        console.log(err);
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