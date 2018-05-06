/* eslint-env node */
import Priority from '../models/PriorityNotify';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import File from '../models/File';
import Announcement from '../models/Announcement';
import {
    sendToTokens,
    sendTopic,
    sendTopicNoContent,
    sendMark,
    sendClassesNoContent,
    sendCoursesNoContent,
    sendToCodesNoContent
} from '../service';
import Class from '../models/Class';
import Student from '../models/Student';
import Feedback from '../models/Feedback';
import Course from '../models/Course';
import {KINDOFRECEIVER,RECEIVER} from '../constant';
import RedisCourse from '../redis/Course';
import _ from 'lodash';

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
    let file = undefined;
    let images = undefined;
    try {
        //check file
        if(req.files && req.files.file && req.files.file.length === 1){
            file = await new File({
                name: req.files.file[0].originalname,
                link: encodeURI(`/department/${req.files.file[0].filename}`)
            }).save();
        }
        //check image
        if(req.files && req.files.images){
            images = _.map(req.files.images,image => encodeURI(`/department/${image.filename}`));
        }
        // save announcement
        let {
            title, content, link, kindOfAnnouncement, priorityNotify, description
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            description,
            descriptionImages: images,
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.STUDENT]
        }).save();

        const message = await announce.getMessage();
        //todo : announce for student by kindOfAnnouncement
        const response = await sendTopicNoContent(message,message.kindOfAnnouncement._id);

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
    let file = undefined;
    let images = undefined;
    try {
        //check file
        if(req.files && req.files.file && req.files.file.length === 1){
            file = await new File({
                name: req.files.file[0].originalname,
                link: encodeURI(`/department/${req.files.file[0].filename}`)
            }).save();
        }
        //check image
        if(req.files && req.files.images){
            images = _.map(req.files.images,image => encodeURI(`/department/${image.filename}`));
        }
        // save announcement
        let {
            title, content, link, kindOfAnnouncement, priorityNotify, description, classes
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            receiver : classes,
            description,
            descriptionImages: images,
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.CLASS]
        }).save();

        const message = await announce.getMessage();
        //todo : announce for student by kindOfAnnouncement
        const response = await sendClassesNoContent(message,classes);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        console.log(err);
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

    let file = undefined;
    let images = undefined;
    try {
        //check file
        if(req.files && req.files.file && req.files.file.length === 1){
            file = await new File({
                name: req.files.file[0].originalname,
                link: encodeURI(`/department/${req.files.file[0].filename}`)
            }).save();
        }
        //check image
        if(req.files && req.files.images){
            images = _.map(req.files.images,image => encodeURI(`/department/${image.filename}`));
        }
        // save announcement
        let {
            title, content, link, kindOfAnnouncement, priorityNotify, description, courses
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            receiver : courses,
            description,
            descriptionImages: images,
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.COURSE]
        }).save();

        const message = await announce.getMessage();
        //todo : announce for student by kindOfAnnouncement
        const response = await sendCoursesNoContent(message,courses);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        console.log(err);
        req.flash('errors', err.message || err.toString());
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

    let file = undefined;
    let images = undefined;
    try {
        //check file
        if(req.files && req.files.file && req.files.file.length === 1){
            file = await new File({
                name: req.files.file[0].originalname,
                link: encodeURI(`/department/${req.files.file[0].filename}`)
            }).save();
        }
        //check image
        if(req.files && req.files.images){
            images = _.map(req.files.images,image => encodeURI(`/department/${image.filename}`));
        }
        // save announcement
        let studentCodes = req.body.students.split(',').map(s => s.trim());
        let {
            title, content, link, kindOfAnnouncement, priorityNotify, description
        } = req.body;
        let sender = req.user.id;
        let kindOfSender = req.user.role;

        const announce = await new Announcement({
            title,content,link,kindOfAnnouncement,
            priorityNotify,sender,kindOfSender,
            file : file ? file.id : null,
            description,
            descriptionImages: images,
            kindOfReceiver : KINDOFRECEIVER[RECEIVER.STUDENT]
        }).save();

        const message = await announce.getMessage();
        //todo : announce for student by kindOfAnnouncement
        const response = await sendToCodesNoContent(message,studentCodes);

        req.flash('success','Push Announcement success!');
    } catch (err) {
        console.log(err);
        req.flash('errors', err.message || err.toString());
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
        if(err) console.log('error',err);
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
                sendMark(notifiMarkData,course.getKeyCourse()),
                // sendMark(notifiMarkData,'int_4050'),
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
        console.log(err);
        res.status(500).json({
            success :  false
        });
    }
};

export const getAnnounce =async (req,res) => {
    let announcement = await Announcement.findByIdJoinAll(req.params.idAnnounce);
    let feedbacks = await Feedback.findByAnnouncementId(req.params.idAnnounce);
    res.render('department/detail-announcement',{
        announcement,
        feedbacks,
        idAnnounce: req.params.idAnnounce
    });
};
