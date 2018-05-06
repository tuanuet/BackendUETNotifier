import * as firebaseService from '../config/firebase';
import { AnnouncementNotification,MarkNotification } from '../response';
const dotenv = require('dotenv');
dotenv.load({path: '.env'});
import Student from '../models/Student';

export const sendCoursesNoContent = async (announcement, courses) => {
    let {title, _id, file, priorityNotify, kindOfAnnouncement, sender, description, descriptionImages} = announcement;
    let tokens = await Student.findTokensByCourses(courses);
    const data = AnnouncementNotification(
        _id ,title, '', _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description, descriptionImages
    );
    return firebaseService.toTokens(tokens,data);
};

export const sendClassesNoContent = async (announcement, classes) => {
    let {title, _id, file, priorityNotify, kindOfAnnouncement, sender, description, descriptionImages} = announcement;
    let tokens = await Student.findTokensByClasses(classes);
    const data = AnnouncementNotification(
        _id ,title, '', _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description, descriptionImages
    );
    return firebaseService.toTokens(tokens,data);
};

export const sendTopicNoContent = (announcement, topic) => {

    let {title, _id, file, priorityNotify, kindOfAnnouncement, sender, description, descriptionImages} = announcement;
    const data = AnnouncementNotification(
        _id ,title, '', _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description, descriptionImages
    );
    return firebaseService.toTopic(topic,data);
};

export const sendToCodesNoContent = async (announcement, codes) => {
    let {title, _id, file, priorityNotify, kindOfAnnouncement, sender, description, descriptionImages} = announcement;
    let tokens = await Student.findTokensByCodes(codes);
    const data = AnnouncementNotification(
        _id ,title, '', _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description, descriptionImages
    );
    return firebaseService.toTokens(tokens,data);
};

export const sendTopic = (announcement, topic) => {

    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender, description, descriptionImages} = announcement;
    const data = AnnouncementNotification(
        _id ,title, content, _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description, descriptionImages
    );
    return firebaseService.toTopic(topic,data);
};

export const sendEveryTopic = (announcement, topics) => {

    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender, description, descriptionImages} = announcement;
    const data = AnnouncementNotification(
       _id, title, content, _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description, descriptionImages
    );
    return firebaseService.toEveryTopicList(topics,data);
};

export const sendToTokens = (announcement, tokens) => {
    let {title, content, _id, file, priorityNotify, kindOfAnnouncement, sender, description, descriptionImages} = announcement;
    const data = AnnouncementNotification(
        _id, title, content, _id, priorityNotify._id, kindOfAnnouncement._id, file ? 1 : 0, sender._id, sender.name, priorityNotify.code, description, descriptionImages
    );
    return firebaseService.toTokens(tokens,data);
};

export const sendMark = (announcement, topic) => {
    let {_id,title,content,link,sender} = announcement;
    const data = MarkNotification(_id,title,content,link,sender._id,sender.name);
    return firebaseService.toTopic(topic,data);
};
