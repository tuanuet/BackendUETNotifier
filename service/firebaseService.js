import * as firebaseService from '../config/firebase';
import request from 'request';
import { AnnouncementNotification,MarkNotification } from '../response';
const dotenv = require('dotenv');
dotenv.load({path: '.env'});


export const sendTopic = (announcement, topic) => {

    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender} = announcement;
    const data = AnnouncementNotification(
        title, content, _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code
    );
    return firebaseService.toTopic(topic,data);
};

export const sendMark = (announcement, topic) => {
    let {_id,title,content,link,sender} = announcement;
    const data = MarkNotification(_id,title,content,link,sender._id,sender.name);
    return firebaseService.toTopic(topic,data);
};

export const sendClass = (data, tokens, retrying) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://gcm-http.googleapis.com/gcm/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${process.env.SERVER_KEY}`
            },
            body: JSON.stringify({
                'data': data,
                'registration_ids': tokens
            })
        }, function (error, response, body) {
            if (error) return reject(error);
            return resolve(body);
        });
    });
};
