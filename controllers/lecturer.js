
import Announcement from '../models/Announcement';
import Priority from '../models/PriorityNotify';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import {KINDOFRECEIVER, RECEIVER} from '../constant';

import {
    sendMark,
    sendCoursesNoContent,
    sendToCodesNoContent
} from '../service';
import Course from '../models/Course';
import RedisCourse from '../redis/Course';
import _ from 'lodash';
import Feedback from '../models/Feedback';

export const getDashboard = async (req,res) => {
    res.render('lecturer/dashboard');
};

export const getManageCourses = async (req,res) => {
    res.render('lecturer/manage-courses');
};
export const getCourseByIdLecturer = async (req,res) => {
    const courses = await Course.getCoursesByIdLecturer(req.user._id);
    res.json(courses);
};

export const getDatatableManageCourses = async (req,res) => {
    Course.dataTable(req.query,function (err,data) {
        res.json(data);
    });
};
export const postRegisterCourse = async (req,res) => {
    const {idCourse,isAdd} = req.body;
    const data = await Course.updateLecturerById(idCourse,req.user._id,isAdd);
    res.json(data);
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
    const courses = await Course.find({lecturers : {$in : [req.user._id]}});
    res.render('lecturer/announce-courses', {
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
                link: encodeURI(`/lecturer/${req.files.file[0].filename}`)
            }).save();
        }
        //check image
        if(req.files && req.files.images){
            images = _.map(req.files.images,image => encodeURI(`/lecturer/${image.filename}`));
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

    res.redirect('/lecturer/announce/courses');
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
    res.render('lecturer/announce-students', {
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
                link: encodeURI(`/lecturer/${req.files.file[0].filename}`)
            }).save();
        }
        //check image
        if(req.files && req.files.images){
            images = _.map(req.files.images,image => encodeURI(`/lecturer/${image.filename}`));
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

    res.redirect('/lecturer/announce/students');
};

export const getHistoryAnnounce = (req, res) => {
    res.render('lecturer/announce-history');
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
    res.render('lecturer/announce-mark-class');
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
                description : `Đã có điểm thi môn ${c.informationClass.courseName}`,
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
    res.render('lecturer/detail-announcement',{
        announcement,
        feedbacks,
        idAnnounce: req.params.idAnnounce
    });
};
