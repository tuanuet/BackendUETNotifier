/* eslint-env node */
const express = require('express');
const router = express.Router();
import * as lecturerController from '../controllers/lecturer';

router.route('/')
    .get(lecturerController.getDashboard);
router.route('/manage/courses')
    .get(lecturerController.getManageCourses);
router.get('/courses',lecturerController.getCourseByIdLecturer);
router.post('/register/course',lecturerController.postRegisterCourse);
router.get('/manage/courses/datatable',lecturerController.getDatatableManageCourses);
module.exports = router;
