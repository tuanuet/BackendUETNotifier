import * as firebaseService from '../config/firebase';
import request from 'request';
import { NotificationResponse } from '../response';
const dotenv = require('dotenv');
dotenv.load({path: '.env'});


export const sendTopic = (announcement, topic, kind) => {

    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender} = announcement;
    const data = NotificationResponse(
        title, content, _id, priorityNotify._id, kindOfAnnouncement._id, kind, file ? 1 : 0, sender._id, sender.name
    );
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
