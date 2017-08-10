/* eslint-env node */
/**
 * Created by vmt on 20/07/2017.
 */
import mongoose from 'mongoose';
import User from '../models/User';
import Class from '../models/Class';
import Course from '../models/Course';
import Term from '../models/Term';
import Major from '../models/Major';
import KindOfNew from '../models/KindOfNew';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import moment from 'moment';
import New from '../models/New';


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
                role: item._id.role,
                createdAt : moment(item.createdAt).format('YYYY-DD-MM')
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
 * get,post,put,delete manage class
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
 * get,post,put,delete manage course
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
/**
 * get,post,put,delete manage term
 */
export const getTerms = async (req,res) => {
    let terms = await Term.find({});
    res.render('admin/management-term',{terms});
};
export const postTerm = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name } = req.body;
        let term = await new Term({name}).save();
        req.flash('success',`Create ${term.name} success!`);
    }catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/term');
    }
};
export const updateTerm = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name, id } = req.body;
        let term = await Term.findOneAndUpdate({_id : id},{name},{new : true});
        req.flash('success',`Update ${term.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/term');
    }
};
export const deleteTerm = async (req,res) => {
    try {
        let { id } = req.body;
        if (!id) throw new Error('Invalid id');
        let term = await Term.findOneAndRemove({_id : id});
        req.flash('success',`Delete ${term.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/term');
    }
};

/**
 * get,post,put,delete manage Major
 */
export const getMajors= async (req,res) => {
    let majors = await Major.find({});
    res.render('admin/management-major',{majors});
};
export const postMajor = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name } = req.body;
        let major = await new Major({name}).save();
        req.flash('success',`Create ${major.name} success!`);
    }catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/major');
    }
};
export const updateMajor = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name, id } = req.body;
        let major = await Major.findOneAndUpdate({_id : id},{name},{new : true});
        req.flash('success',`Update ${major.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/major');
    }
};
export const deleteMajor= async (req,res) => {
    try {
        let { id } = req.body;
        if (!id) throw new Error('Invalid id');
        let major = await Major.findOneAndRemove({_id : id});
        req.flash('success',`Delete ${major.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/major');
    }
};

/**
 * get,post,put,delete manage Kind of New
 */
const UrlReg = new RegExp('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?');
export const getKindOfNews= async (req,res) => {
    let kindofnews = await KindOfNew.find({});
    res.render('admin/management-kindofnew',{kindofnews});
};
export const postKindOfNew = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    req.assert('link', 'Link is not valid').len(5);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name, link } = req.body;
        if(!UrlReg.test(link)) throw new Error('link is not valid');
        let kindofnew = await new KindOfNew({name,link}).save();
        req.flash('success',`Create ${kindofnew.name} success!`);
    }catch (err) {
        console.log(err);
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/kindofnew');
    }
};
export const updateKindOfNew = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    req.assert('link', 'Link is not valid').len(5);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name, id ,link } = req.body;
        if(!UrlReg.test(link)) throw new Error('link is not valid');
        let kindofnew = await KindOfNew.findOneAndUpdate({_id : id},{name,link},{new : true});
        req.flash('success',`Update ${kindofnew.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/kindofnew');
    }
};
export const deleteKindOfNew= async (req,res) => {
    try {
        let { id } = req.body;
        if (!id) throw new Error('Invalid id');
        let kindofnew = await KindOfNew.findOneAndRemove({_id : id});
        req.flash('success',`Delete ${kindofnew.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/kindofnew');
    }
};
/**
 * get,post,put,delete manage New
 */
export const getNews = async (req,res) => {
    console.log('Body getNews: ',req.body);
    let news = await New.find({});
    res.render('admin/management-new',{news});
};
export const deleteNew = async (req,res) => {
    try {
        let { id } = req.body;
        if (!id) throw new Error('Invalid id');
        let _new = await New.findOneAndRemove({_id : id});
        req.flash('success',`Delete ${_new.title} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/new');
    }
};
/**
 * get,post,put,delete manage Kind of New
 */

export const getKindOfAnnouncements= async (req,res) => {
    let kindofannouncements = await KindOfAnnouncement.find({});
    res.render('admin/management-kindofannouncement',{kindofannouncements});
};
export const postKindOfAnnouncement = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name } = req.body;
        let kindofannouncement = await new KindOfAnnouncement({name}).save();
        req.flash('success',`Create ${kindofannouncement.name} success!`);
    }catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/kindofannouncement');
    }
};
export const updateKindOfAnnouncement = async (req,res) => {
    req.assert('name', 'Name is not valid').len(1);
    const errors = req.validationErrors();
    try {
        if (errors) throw new Error(errors);
        let { name, id } = req.body;
        let kindofannouncement = await KindOfAnnouncement.findOneAndUpdate({_id : id},{name},{new : true});
        req.flash('success',`Update ${kindofannouncement.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/kindofannouncement');
    }
};
export const deleteKindOfAnnouncement= async (req,res) => {
    try {
        let { id } = req.body;
        if (!id) throw new Error('Invalid id');
        let kindofannouncement = await KindOfAnnouncement.findOneAndRemove({_id : id});
        req.flash('success',`Delete ${kindofannouncement.name} success!`);
    } catch (err) {
        req.flash('errors', err.name || err.toString());
    } finally {
        res.redirect('/admin/manage/kindofannouncement');
    }
};
