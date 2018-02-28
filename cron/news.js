import * as firebaseService from '../config/firebase';
import * as helper from '../helper';
const {CronJob} = require('cron');
const service = require('../service/index');
const _ = require('lodash');
const PAGE_CHECK = 'https://uet.vnu.edu.vn/category/tin-tuc/tin-sinh-vien/';
const New = require('../models/New');

let job = new CronJob({
    cronTime: '* 15 * * * 1-5',
    onTick: function () {
        console.log('run here!');
        Promise.all([
            service.getNewsInpage(PAGE_CHECK),
            New.findTenNews()
        ])
            .then( data => Promise.resolve(_.differenceBy(data[0],data[1],'link')))
            .then( news => {
                if(news.length === 0) {
                    return Promise.reject(new Error('Don\'t import anythings'));
                }
                return New.create(news);
            })
            .then( news => {
                let promises = _.map(news,(n) => {
                    const data = n.getDataNotification();
                    return firebaseService.toTopic(helper.getTagsOfNews(n.tags)[0]._id,data);
                });
                return Promise.all(promises);
            })
            .then(responses => console.log('Import and send notification success!'))
            .catch(err => console.log(err.message));

    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});
module.exports = job;