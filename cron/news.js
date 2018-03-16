import * as firebaseService from '../config/firebase';
import * as helper from '../helper';
const {CronJob} = require('cron');
const service = require('../service/index');
const _ = require('lodash');
const PAGE_CHECK = 'https://uet.vnu.edu.vn/category/tin-tuc/tin-sinh-vien/';
const New = require('../models/New');
import moment from 'moment';
import chalk from 'chalk';
let job = new CronJob({
    cronTime: '*/15 * * * 1-5',
    onTick: function () {
        Promise.all([
            service.getNewsInpage(PAGE_CHECK),
            New.findTwentyNews()
        ])
            .then( data => Promise.resolve(_.differenceBy(data[0],data[1],'link')))
            .then( news => {
                if(news.length === 0) {
                    return Promise.reject(new Error('don\'t import anythings'));
                }
                return New.create(news);
            })
            .then( news => {
                let promises = _.map(news,(n) => {
                    const data = n.getDataNotification();
                    const topics = helper.snakeCaseArray(n.tags);
                    return firebaseService.toSomeTopicList(topics,data);
                });
                return Promise.all(promises);
            })
            .then(responses => {
                console.log('%s ---- %s',moment().format(), chalk.green('✓import and send notification success!'));
            })
            .catch(err => {
                console.log('%s ---- %s',moment().format(), chalk.red(`✗${err.message}!`));
            });

    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});

module.exports = job;