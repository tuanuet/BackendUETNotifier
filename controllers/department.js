/* eslint-env node */
import Priority from '../models/PriorityNotify';
import KindOfAnnouncement from '../models/KindOfAnnouncement';
import File from '../models/File';

export const getDashboard = (req, res) => {
    res.render('department/dashboard')
};
export const getAnnounceAll = async (req, res) => {
    const kindOfAnnouncement = await KindOfAnnouncement.find({});
    const priority = await Priority.find({});
    res.render('department/announce-all', {
        kindOfAnnouncement,
        priority
    })
};

export const postAnnounceAll = async (req, res) => {
    ///todo : lưu ten file vao db
    let file = null;
    try {
        if(req.file){
            file = await new File({
                name: req.file.originalname,
                link: `/department/${req.file.filename}`
            }).save();
        }

        //todo:  save announcement


        req.flash('success',`Push Announcement success!`);
    } catch (err) {
        req.flash('errors', err.message || err.toString());
        console.log(err.message)
    }
    //todo : gui thong bao
    res.redirect('/department/announce/all')
};