import KindOfNew from '../models/KindOfNew';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import Priority from '../models/PriorityNotify';
import Announcement from '../models/Announcement';
import New from '../models/New';
import * as service from '../service';

export const getKindOfNews = async (req,res) => {
    let loaiTinTucs = await KindOfNew.find({});
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

/**
 *  API FOR ANDROID
 */
export const getNewsPagination = async (req,res) => {
    const loaiTinTuc = parseInt(req.query.tags);
    const offset = parseInt(req.query.offset);
    let news = await New.find();
    res.json(news);
};

export const getDetailNew = async (req,res) => {
    const url = req.query.url;
    res.render('api/detail-new',{
        result : await service.parseDetailNew(url)
    });
};