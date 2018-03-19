/* eslint-env node */
const express = require('express');
const router = express.Router();
import New from '../models/New';
import * as firebaseService from '../config/firebase';
import * as helper from '../helper';
import * as passportMiddleware from '../config/passport';
import Feedback from '../models/Feedback';

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
                const {announcementId,kindSender,content,isSub,rootId} = req.body;

                let feedBack = new Feedback({
                    announcementId,
                    kindSender,
                    content,
                    sender: user._id,
                    subFeedback: isSub === true ? rootId : null
                });
                await feedBack.save();
                res.json({
                    success: true,
                    message: 'Insert success!',
                });
            } catch (err) {
                res.status(403).json({
                    success: true,
                    message: 'Insert success!',
                });
            }
        })
    .get(async (req,res,next) => {
        const _id = req.query.announcementId;
        let feedBack = await Feedback.findByAnnouncementId(_id);
        res.jsonp(feedBack);
    });

module.exports = router;
