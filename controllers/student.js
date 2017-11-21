/* eslint-env node */

import Student from '../models/Student';

export const saveToken = async (req,res) => {
    try {
        var tokenFirebase = req.body.tokenFirebase;
        if (!tokenFirebase) throw new Error('no have token in params');
        await Student.update(req.user._id, {token: tokenFirebase});
        return res.json({success: true, message: 'ok'});
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            message: err.message
        });
    }
};