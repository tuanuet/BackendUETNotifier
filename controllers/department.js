/* eslint-env node */
import Priority from '../models/PriorityNotify';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import File from '../models/File';
import Announcement from '../models/Announcement';
import {sendClass, sendTopic} from '../config/gcm';
import Class from '../models/Class';
import Student from '../models/Student';
import Course from '../models/Course';
import {KINDOFRECEIVER} from '../constant';
var RECEIVER = {
    ALL : 0, COURSE : 1, CLASS : 2, STUDENT : 3
};
export const getDashboard = (req, res) => {
    res.render('department/dashboard');
};
export const getAnnounceAll = async (req, res) => {
    const kindOfAnnouncement = await KindOfAnnouncement.find({});
    const priority = await Priority.find({});
    res.render('department/announce-all', {
        kindOfAnnouncement,
        priority
    });
};

/**
 * Push notification for all student
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
export const postAnnounceAll = async (req, res) => {
    /// lưu ten file vao db
    let file = null;
    try {
        if(req.file){
            file = await new File({
                name: req.file.originalname,
                link: `/department/${req.file.filename}`
            }).save();
        }
        // save announcement
        let {
            title, content, link, kindOfAnnouncement, priorityNotify
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.STUDENT]
        }).save();

        const message = await announce.getMessage();
        //todo : announce for student by kindOfAnnouncement
        const response = await sendTopic(message,message.kindOfAnnouncement.id,1);
        console.log('response',response);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        req.flash('errors', err.message || err.toString());
        console.log(err.message);
    }
    res.redirect('/department/announce/all');
};

/**
 * get notification for classes
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
export const getAnnounceClasses = async (req,res) => {
    const kindOfAnnouncement = await KindOfAnnouncement.find({});
    const priority = await Priority.find({});
    const classes = await Class.find({});
    res.render('department/announce-classes', {
        kindOfAnnouncement,
        priority,
        classes
    });
};

export const postAnnounceClasses = async (req,res) => {
    /// lưu ten file vao db
    let file = null;
    try {
        if(req.file){
            file = await new File({
                name: req.file.originalname,
                link: `/department/${req.file.filename}`
            }).save();
        }
        // save announcement
        let {
            title, content, link, kindOfAnnouncement, priorityNotify, classes
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        console.log(req.body);

        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            receiver : classes,
            kindOfReceiver: KINDOFRECEIVER[RECEIVER.CLASS]
        }).save();

        const message = await announce.getMessage();
        //todo : announce for student by classes
        //todo : find all student in class
        let students = await Student.findStudentByClasses(classes);
        //todo : get token in student
        let tokens = students.map(item =>{
            return item.token;
        });
        const response = await sendClass(message,tokens,1);
        console.log('response',response);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        req.flash('errors', err.message || err.toString());
        console.log(err.message);
    }
    res.redirect('/department/announce/classes');
};

/**
 * get notification for courses
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
export const getAnnounceCourses = async (req,res) => {
    const kindOfAnnouncement = await KindOfAnnouncement.find({});
    const priority = await Priority.find({});
    const courses = await Course.find({});
    res.render('department/announce-courses', {
        kindOfAnnouncement,
        priority,
        courses
    });
};

export const postAnnounceCourses = async (req,res) => {
    //lưu ten file vao db
    let file = null;
    try {
        if(req.file){
            file = await new File({
                name: req.file.originalname,
                link: `/department/${req.file.filename}`
            }).save();
        }
        // save announcement
        let {
            title, content, link, kindOfAnnouncement, priorityNotify, courses
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            receiver : courses,
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.COURSE]
        }).save();

        const message = await announce.getMessage();
        // announce for student by courses
        // find all student in course
        let students = await Student.findStudentByCourses(courses);
        // get token in student
        let tokens = students.map(item =>{
            return item.token;
        });
        const response = await sendClass(message,tokens,1);
        console.log('response',response);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        req.flash('errors', err.message || err.toString());
        console.log(err.message);
    }
    res.redirect('/department/announce/courses');
};

export const getHistoryAnnounce = (req, res) => {
    res.render('department/announce-history');
};

export const getHistoryAnnounceDatatable = (req, res) => {
    Announcement.dataTable(req.query,function (err,data) {
        res.json(data);
    });
};

export const getAnnounce = (req,res) => {
    res.send(req.url);
};