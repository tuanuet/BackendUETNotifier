import * as firebaseService from '../config/firebase';
import request from 'request';
import { AnnouncementNotification,MarkNotification } from '../response';
const dotenv = require('dotenv');
dotenv.load({path: '.env'});


export const sendTopic = (announcement, topic) => {

    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender, description} = announcement;
    const data = AnnouncementNotification(
        title, content, _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description
    );
    return firebaseService.toTopic(topic,data);
};
export const sendEveryTopic = (announcement, topics) => {

    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender, description} = announcement;
    const data = AnnouncementNotification(
        title, content, _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description
    );
    return firebaseService.toEveryTopicList(topics,data);
};

export const sendToTokens = (announcement, tokens) => {
    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender, description} = announcement;
    const data = AnnouncementNotification(
        title, content, _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description
    );
    return firebaseService.toTokens(tokens,data);
};

export const sendMark = (announcement, topic) => {
    let {_id,title,content,link,sender} = announcement;
    const data = MarkNotification(_id,title,content,link,sender._id,sender.name);
    return firebaseService.toTopic(topic,data);
};
