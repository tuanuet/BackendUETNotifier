/* eslint-env node */
const express = require('express');
const router = express.Router();
import New from '../models/New';
import * as firebaseService from '../config/firebase';
import * as helper from '../helper';
router.get('/sendNewsNotification',async (req,res) => {
    let news = await New.find({});
    let data = news[0].getDataNotification();
    const response = await firebaseService.toTopic(helper.getTagsOfNews(news[0].tags)[0]._id,data);
    res.json(response);
});

router.get('/ten-news',async (req,res) => {
    let news = await New.findTenNews();
    res.json(news);
});

router.get('/notification-course',async (req,res) => {
    let news = await New.find({});
    let data = news[0].getDataNotification();
    const response = await firebaseService.toEveryTopicList(['int_4050','tin_sinh_vien','int_8833'],data);
    res.json(response);
});

module.exports = router;
