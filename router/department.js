/* eslint-env node */
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department');
const multer = require('multer');
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join(__dirname,'../uploads/department'));
    },
    filename : function (req, file, callback) {
        callback(null,Date.now()+file.originalname);
    },
});
const upload = multer({storage});

router.route('/')
    .get(departmentController.getDashboard);


const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'images', maxCount: 10 }]);
router.route('/announce/all')
    .get(departmentController.getAnnounceAll)
    .post(cpUpload,
        departmentController.postAnnounceAll);

router.route('/announce/classes')
    .get(departmentController.getAnnounceClasses)
    .post(upload.single('file'),departmentController.postAnnounceClasses);

router.route('/announce/courses')
    .get(departmentController.getAnnounceCourses)
    .post(upload.single('file'),departmentController.postAnnounceCourses);

router.route('/announce/students')
    .get(departmentController.getAnnounceStudents)
    .post(upload.single('file'),departmentController.postAnnounceStudents);

router.get('/manage/announce/history',departmentController.getHistoryAnnounce);
router.get('/manage/announce/history/data-table',departmentController.getHistoryAnnounceDatatable);
router.get('/manage/announce/:idAnnounce',departmentController.getAnnounce);


router.route('/announce/mark')
    .get(departmentController.getMark)
    .post(upload.single('file'),departmentController.postMarks);

module.exports = router;
