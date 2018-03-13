import KindOfNew from '../models/KindOfNew';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import Priority from '../models/PriorityNotify';
import Announcement from '../models/Announcement';
import New from '../models/New';
import Student from '../models/Student';
import Lecturer from  '../models/Leturer';
import * as service from '../service';
import * as helper from '../helper';
import {KIND_OF_NEW_LIST, NEW_LIMIT} from '../constant';
import path from 'path';
import Course from '../models/Course';
import * as response from '../response';
import Mark from '../redis/Mark';
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import _ from 'lodash';

export const postLogout = async (req,res) => {
    req.logout();
    res.status(200).json({
        success: true,
        message: 'Bạn đã đăng xuất thành công!'
    });

};

export const getKindOfNews = async (req, res) => {
    let loaiTinTucs = KIND_OF_NEW_LIST();
    res.json(loaiTinTucs);
};

export const getKindOfAnnouncements = async (req, res) => {
    let kindOfAnnouncements = await KindOfAnnouncement.find({});
    res.json(kindOfAnnouncements);
};

export const getPriorities = async (req, res) => {
    let priorities = await Priority.find({});
    res.json(priorities);
};

export const getAnnouncementById = async (req, res, next) => {
    const view = 'api/detail-notification';
    let announce = await Announcement.findByIdJoinAll(req.params.id);
    const decode = entities.decode(announce.content);
    announce['content'] = await helper.renderPromise(res, view, decode);
    res.json(announce);
};

export const getAvatarByUserId = async (req, res, next) => {
    console.log(path.resolve(__dirname, '../public/assets/images/avatar-1.jpg'));
    res.sendFile(path.resolve(__dirname, '../public/assets/images/avatar-1.jpg'));
};
/**
 *  API FOR ANDROID
 */
export const getNewsPagination = async (req, res) => {
    try {
        const idTag = req.query.loaitintuc;
        const offset = parseInt(req.query.offset);
        if (idTag === 'tat_ca_tin_tuc') {
            return res.json(await New.find().sort({'postAt': -1}).skip(offset).limit(NEW_LIMIT));
        }
        const tag = helper.getNameTagBySnake(idTag);
        let news = await New.findByTagName(tag.name).skip(offset).limit(NEW_LIMIT);
        res.json(news);
    } catch (err) {
        res.status(404).json([]);
    }

};

export const getDetailNew = async (req, res) => {
    const url = req.query.url;
    res.render('api/detail-new', {
        result: await service.parseDetailNew(url)
    });
};

export const getCourse = async (req, res) => {
    try {
        let student = await Student.findById(req.user._id);
        res.json(helper.snakeCaseArray(student.courses));
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        });
    }
};

export const getMark = async (req, res) => {
    const idCourse = req.params.idCourse;
    // let course = await Course.findOne({
    //     _id : idCourse
    // });

    //todo : test
    let course = await Course.find({});
    let data = await Mark.getMarkByKeyCourse(idCourse);
    // let data = _(redisData).map();

    return res.json(response.MarkResponse(course[0],data));

};

export const getInformationCourseById = async (req,res) => {
    try {
        const course = await Course.findCourseAndLecturerById(req.params.courseId);
        const students = await Student.findByCourseId(req.params.courseId);
        res.json({
            course,
            students
        });
    } catch (err) {
        console.log(err);
    }
};

export const fetchingNewsAndAnnouncement = async (req,res) => {
    const {
        lastTimeAnnouncement= new Date(),
        lastTimeNew= new Date(),
        kindAnnouncements= [], //lich_thi
        kindNews= [] //lich_thi
    } = req.body;

    const announcementTopics = kindAnnouncements;     //['lich_thi'];
    const newTopics = _.map(kindNews,helper.getTopicNameByCode); //return ["Lịch Thi"]

    let announcements =await Announcement.fetching(announcementTopics,new Date(lastTimeAnnouncement));
    let news = await New.fetching(newTopics,new Date(lastTimeNew));

    res.jsonp({announcements,news});
};
