/* eslint-env node */
/**
 * Created by vmt on 20/07/2017.
 */
import mongoose from 'mongoose';
import User from '../models/User';
import Class from '../models/Class';
import Course from '../models/Course';

export const getDashboard = async (req,res) => {
    res.render('admin/dashboard');
};
/**
 * manage
 */
export const getManagementAccount = async function (req, res) {
    const role = (req.query.role);
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
        res.redirect(`/admin/manage/account?role=${stringModel.toLocaleLowerCase()}`);
    }
};
export const updateAccount = async function(req, res) {
    let role = (req.query.role );
    const stringModel = role.charAt(0).toUpperCase() + role.slice(1);

    req.assert('name', 'Name is not valid').len(1);
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    try {
        const Model = mongoose.model(stringModel);
        if (errors) throw new Error(errors);
        let { email, password, name, id } = req.body;

        await User.findOneAndUpdate({_id : id}, { email, password, name },{new: true});
        let model = await Model.findOneAndUpdate({_id: id}, { email, password, name },{new: true});

        req.flash('success', `Update ${model.name} success!`);
    } catch (e) {
        req.flash('errors', e.toString());
    } finally {
        res.redirect(`/admin/manage/account?role=${stringModel.toLocaleLowerCase()}`);
    }
};
export const deleteAccount = async function (req, res){
    const role = (req.query.role);
    const stringModel = role.charAt(0).toUpperCase() + role.slice(1);
    try {
        const { id } = req.body;
        const Model = mongoose.model(stringModel);
        await Model.findOneAndRemove({ _id: id });
        req.flash('success', 'Delete success!');
    } catch (err) {
        req.flash('errors', err);
    } finally {
        res.redirect(`/admin/manage/account?role=${stringModel.toLocaleLowerCase()}`);
    }
};
export const postAccount = async function (req, res) {
    const role = (req.query.role);
    const stringModel = role.charAt(0).toUpperCase() + role.slice(1);

    req.assert('name', 'Name is not valid').len(1);
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

        req.flash('success',`Create ${model.name}success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    }finally {
        res.redirect(`/admin/manage/account?role=${stringModel.toLocaleLowerCase()}`);
    }
};

/**
 * get html manage class
 */
export const getClasses = async (req,res) => {
    let classes = await Class.find({});
    res.render('admin/management-class',{classes});
};
export const postClass = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name } = req.body;
        let clas = await new Class({name}).save();
        req.flash('success',`Create ${clas.name}success!`);
    }catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/class');
    }
};
export const updateClass = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name, id } = req.body;
        let clas = await Class.findOneAndUpdate({_id : id},{name},{new : true});
        req.flash('success',`Update ${clas.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/class');
    }
};
export const deleteClass = async (req,res) => {
    try {
        let { id } = req.body;
        if (!id) throw new Error('Invalid id');
        let clas = await Class.findOneAndRemove({_id : id});
        req.flash('success',`Delete ${clas.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/class');
    }
};

/**
 * get html manage course
 */
export const getCourses = async (req,res) => {
    let courses = await Course.find({});
    res.render('admin/management-course',{courses});
};
export const postCourse = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name } = req.body;
        let course = await new Course({name}).save();
        req.flash('success',`Create ${course.name} success!`);
    }catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/course');
    }
};
export const updateCourse = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name, id } = req.body;
        let course = await Course.findOneAndUpdate({_id : id},{name},{new : true});
        req.flash('success',`Update ${course.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/course');
    }
};
export const deleteCourse = async (req,res) => {
    try {
        let { id } = req.body;
        if (!id) throw new Error('Invalid id');
        let course = await Course.findOneAndRemove({_id : id});
        req.flash('success',`Delete ${course.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/course');
    }
};