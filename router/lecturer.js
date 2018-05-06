/* eslint-env node */
const express = require('express');
const router = express.Router();
import * as lecturerController from '../controllers/lecturer';
const multer = require('multer');
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join(__dirname,'../uploads/lecturer'));
    },
    filename : function (req, file, callback) {
        callback(null,Date.now()+file.originalname);
    },
});
const upload = multer({storage});
const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'images', maxCount: 10 }]);

router.route('/')
    .get(lecturerController.getDashboard);
router.route('/manage/courses')
    .get(lecturerController.getManageCourses);
router.get('/courses',lecturerController.getCourseByIdLecturer);
router.post('/register/course',lecturerController.postRegisterCourse);
router.get('/manage/courses/datatable',lecturerController.getDatatableManageCourses);

router.route('/announce/courses')
    .get(lecturerController.getAnnounceCourses)
    .post(cpUpload,lecturerController.postAnnounceCourses);

router.route('/announce/students')
    .get(lecturerController.getAnnounceStudents)
    .post(cpUpload,lecturerController.postAnnounceStudents);

router.get('/manage/announce/history',lecturerController.getHistoryAnnounce);
router.get('/manage/announce/history/data-table',lecturerController.getHistoryAnnounceDatatable);
router.get('/manage/announce/:idAnnounce',lecturerController.getAnnounce);


router.route('/announce/mark')
    .get(lecturerController.getMark)
    .post(upload.single('file'),lecturerController.postMarks);

module.exports = router;
