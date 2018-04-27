/* eslint-env node */
const express = require('express');
const router = express.Router();
import New from '../models/New';
import * as firebaseService from '../config/firebase';
import * as helper from '../helper';
import * as passportMiddleware from '../config/passport';
import Feedback from '../models/Feedback';
import Student from '../models/Student';
import Announcement from '../models/Announcement';
import * as Response from '../response';
const MobileDetect = require('mobile-detect');

router.get('/sendNewsNotification',async (req,res) => {
    let news = await New.find({});
    let data = news[0].getDataNotification();
    const response = await firebaseService.toTopic(helper.getTagsOfNews(news[0].tags)[0]._id,data);
    res.json(response);
});

router.get('/twenty-news',async (req,res) => {
    let news = await New.findTwentyNews();
    res.json(news);
});

router.get('/notification-course',async (req,res) => {
    let news = await New.find({});
    let data = news[0].getDataNotification();
    const response = await firebaseService.toEveryTopicList(['int_4050','tin_sinh_vien','int_8833'],data);
    res.json(response);
});

router.route('/feedback')
    .post(
        passportMiddleware.detectClientAuthenticated,
        passportMiddleware.validateAuthenticated,async (req,res) => {
            try {
                const user = req.user;
                const {announcementId,content,isSub,rootId} = req.body;
                let feedBack = new Feedback({
                    announcementId,
                    kindSender: user.role,
                    content,
                    sender: user._id,
                    subFeedback: isSub === 'true' || isSub === true ? rootId : null
                });

                await feedBack.save();
                const respFeedBack = await Feedback.findByIdAndPopulate(feedBack._id);
                //User # Student
                if(user.role !== 'Student'){
                    const announcement = await Announcement.findById(announcementId);
                    const message = await firebaseService.toTopic(announcement.kindOfAnnouncement,Response.FeedbackNotification(respFeedBack));
                    console.log(Response.FeedbackNotification(respFeedBack));
                }
                res.jsonp(respFeedBack);
            } catch (err) {
                res.status(403).json({
                    success: true,
                    message: 'Insert failure!',
                });
            }
        })
    .get(async (req,res,next) => {
        const _id = req.query.announcementId;
        let feedBack = await Feedback.findByAnnouncementId(_id);
        res.jsonp(feedBack);
    });

module.exports = router;
