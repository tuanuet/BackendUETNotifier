import KindOfNew from '../models/KindOfNew';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import Priority from '../models/PriorityNotify';

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