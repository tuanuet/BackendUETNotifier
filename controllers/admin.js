/* eslint-disable spaced-comment */
/*env node*/
/**
 * Created by vmt on 20/07/2017.
 */
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt-nodejs';

export const getDashboard = (req, res) => {
    res.render('admin/dashboard');
}
export const getManagementAccount = async function(req, res) {
    const role = (req.params.role);
    const stringModel = role.charAt(0).toUpperCase() + role.slice(1);
    try {
        const Model = mongoose.model(stringModel);
        let models = await Model.find({}).populate({ path: '_id' });
        const results = models.map( item => {
            return {
                id: item._id.id,
                name: item.name,
                email: item._id.email,
                password: item._id.password,
                role: item._id.role
            };
        });
        res.render('admin/management-account', {models: results});
    } catch (e) {
        req.flash('errors', e.toString());
        return res.redirect(`/admin/manage/${stringModel.toLocaleLowerCase()}`);
    }
};


/**
 * updateAccount
 */
export const updateAccount = async function(req, res, next) {
    let role = (req.params.role );
    const stringModel = role.charAt(0).toUpperCase() + role.slice(1);

    req.assert('name', 'Email is not valid').len(1);
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    try {
        const Model = mongoose.model(stringModel);
        if (errors) throw new Error(errors);
        let { email, password, name, id } = req.body;
        await Model.findOneAndUpdate({_id: id}, { email, password, name });
        req.flash('success', 'Update success!');
    } catch (e) {
        req.flash('errors', e.toString());
    } finally {
        return res.redirect(`/admin/manage/${stringModel.toLocaleLowerCase()}`);
    }
};
/**
 * delete account by id
 */
export const deleteAccount = async function (req, res){
    const role = (req.params.role);
    const stringModel = role.charAt(0).toUpperCase() + role.slice(1);
    try {
        const { id } = req.body;
        const Model = mongoose.model(stringModel);
        await Model.findOneAndRemove({ _id: id });
        req.flash('success', 'Delete success!');
    } catch (err) {
        req.flash('errors', err);
    } finally {
        return res.redirect(`/admin/manage/${stringModel.toLocaleLowerCase()}`);
    }
};
/**
 * create model method post
 */
export const postAccount = async function (req, res) {
    const role = (req.params.role);
    const stringModel = role.charAt(0).toUpperCase() + role.slice(1);

    req.assert('name', 'Email is not valid').len(1);
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    try {
        let {email, password, name} = req.body;
        const Model = mongoose.model(stringModel);
        if (errors) throw new Error(errors);
        let user = await new User({email, password, role: stringModel }).save();
        let model = await new Model({_id: user.id, name}).save();
        req.flash('success', 'Create success!');
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    }finally {
        return res.redirect(`/admin/manage/${stringModel.toLocaleLowerCase()}`);
    }
};
