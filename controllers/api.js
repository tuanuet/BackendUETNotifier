import KindOfNew from '../models/KindOfNew';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import Priority from '../models/PriorityNotify';
import Announcement from '../models/Announcement';
import New from '../models/New';
import * as service from '../service';
import * as helper from '../helper';
import {KIND_OF_NEW_LIST,NEW_LIMIT} from '../constant';
import path from 'path';
export const getKindOfNews = async (req,res) => {
    let loaiTinTucs = KIND_OF_NEW_LIST();
    res.json(loaiTinTucs);
};

export const getKindOfAnnouncements = async (req,res) => {
    let kindOfAnnouncements = await KindOfAnnouncement.find({});
    res.json(kindOfAnnouncements);
};

export const getPriorities = async (req,res) => {
    let priorities = await Priority.find({});
    res.json(priorities);
};

export const getAnnouncementById = async (req, res, next) => {
    let announce = await Announcement.findByIdJoinAll(req.params.id);
    res.json(announce);
};

export const getAvatarByUserId = async (req,res,next) => {
    console.log(path.resolve(__dirname,'../public/assets/images/avatar-1.jpg'));
    res.sendFile(path.resolve(__dirname,'../public/assets/images/avatar-1.jpg'));
};
/**
 *  API FOR ANDROID
 */
export const getNewsPagination = async (req,res) => {
    try {
        const idTag = req.query.loaitintuc;
        const offset = parseInt(req.query.offset);
        if(idTag === 'tat_ca_tin_tuc'){
            return res.json(await New.find().skip(offset).limit(NEW_LIMIT));
        }
        const tag = helper.getNameTagBySnake(idTag);
        let news = await New.findByTagName(tag.name).skip(offset).limit(NEW_LIMIT);
        res.json(news);
    } catch (err) {
        res.status(404).json([]);
    }

};

export const getDetailNew = async (req,res) => {
    const url = req.query.url;
    res.render('api/detail-new',{
        result : await service.parseDetailNew(url)
    });
};