/* eslint-env node */
const express = require('express');
const router = express.Router();
import New from '../models/New';
import * as firebaseService from '../config/firebase';
import * as helper from '../helper';
router.get('/sendNewsNotification',async (req,res) => {
    let news = await New.find({});
    let data = news[0].getDataNotification();
    await firebaseService.toTopic(helper.getTagsOfNews(news[0].tags)[0]._id,data);
    res.json();
});

router.get('/ten-news',async (req,res) => {
    let news = await New.findTenNews();
    res.json(news);
});

module.exports = router;
