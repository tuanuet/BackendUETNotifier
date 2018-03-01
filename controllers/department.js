/* eslint-env node */
import Priority from '../models/PriorityNotify';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import File from '../models/File';
import Announcement from '../models/Announcement';
import {sendToTokens, sendTopic,sendMark} from '../service';
import Class from '../models/Class';
import Student from '../models/Student';
import Course from '../models/Course';
import {KINDOFRECEIVER,RECEIVER} from '../constant';
import RedisCourse from '../redis/Course';
import _ from 'lodash';
import {sendEveryTopic} from '../service/firebaseService';

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
        const response = await sendTopic(message,message.kindOfAnnouncement._id);
        console.log('response',response);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        console.log(err);
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
        const response = await sendToTokens(message,tokens);
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
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.COURSE]
        }).save();

        const message = await announce.getMessage();
        //todo : announce for student by kindOfAnnouncement
        const response = await sendEveryTopic(message,[message.kindOfAnnouncement._id,...courses]);
        console.log('response',response);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        req.flash('errors', err.message || err.toString());
        console.log(err.message);
    }
    res.redirect('/department/announce/courses');
};

/**
 * get notification for courses
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
export const getAnnounceStudents = async (req,res) => {
    const kindOfAnnouncement = await KindOfAnnouncement.find({});
    const priority = await Priority.find({});
    res.render('department/announce-students', {
        kindOfAnnouncement,
        priority,
    });
};

export const postAnnounceStudents = async (req,res) => {
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

        let studentCodes = req.body.students.split(',');
        let studentInDbs = await Student.findByArrayId(studentCodes);
        let students = studentInDbs.map(stu => stu._id);

        let {
            title, content, link, kindOfAnnouncement, priorityNotify
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        //create annouce
        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            receiver : students,
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.STUDENT]
        }).save();

        const message = await announce.getMessage();
        // announce for student by courses

        // get token in student
        let tokens = studentInDbs.map(student =>{
            return student.token;
        });
        //send fcm
        const response = await sendToTokens(message,tokens);
        console.log('response',response);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        req.flash('errors', err.message || err.toString());
        console.log(err);
    }
    res.redirect('/department/announce/students');
};

export const getHistoryAnnounce = (req, res) => {
    res.render('department/announce-history');
};

export const getHistoryAnnounceDatatable = (req, res) => {
    let opts = {
        conditions: {
            sender : req.user._id
        }
    };
    Announcement.dataTable(req.query,opts,function (err,data) {
        res.json(data);
    });
};

export const getMark = (req ,res) => {
    res.render('department/announce-mark-class');
};

export const postMarks = async (req ,res) => {
    let sender = req.user.id;
    let kindOfSender = req.user.role;
    try{
        let courses = req.body.data;
        let idCoursePromises = _(courses).map(async c => {
            let course = new RedisCourse(c.informationClass.idCourse,c.headers,c.points);
            // create Announcement
            let notifiMarkData = await (new Announcement({
                title : 'Thông báo điểm thi',
                content : `Đã có điểm thi môn ${c.informationClass.courseName}`,
                link: `${course.getKeyCourse()}`,
                kindOfAnnouncement : null,
                priorityNotify: (await Priority.findOne({code : 'canh_bao'}))._id,
                sender,
                kindOfSender,
                file : null,
                kindOfReceiver : KINDOFRECEIVER[RECEIVER.STUDENT]
            }).save()).then(a => a.getMessage());
            // sendTo topic

            const results = await Promise.all([
                //todo:sendMark(announce,course.getKeyCourse()),
                sendMark(notifiMarkData,'int_4050'),
                course.save()
            ]);
            return results[1];
        });

        let idCourses = await Promise.all(idCoursePromises);
        res.status(200).json({
            success :  true,
            idCourses
        });
    } catch (err){
        res.status(500).json({
            success :  false
        });
    }
};

export const getAnnounce = (req,res) => {
    res.send(req.url);
};
