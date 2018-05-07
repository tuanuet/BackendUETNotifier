/* eslint-env node */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.route('/')
    .get(adminController.getDashboard);
/**
 * edit, post, delete user
 */
router.route('/manage/account/:role')
    .get(adminController.getManagementAccount)
    .post(adminController.postAccount)
    .put(adminController.updateAccount)
    .delete(adminController.deleteAccount);
router.get('/manage/account/:role/datatable',adminController.accountDatatable);
/**
 * get, edit, post, delete class
 */
router.route('/manage/class')
    .get(adminController.getClasses)
    .post(adminController.postClass)
    .put(adminController.updateClass)
    .delete(adminController.deleteClass);
router.get('/manage/class/datatable',adminController.classDatatable);

/**
 * get, edit, post, delete class
 */
router.route('/manage/course')
    .get(adminController.getCourses)
    .post(adminController.postCourse)
    .put(adminController.updateCourse)
    .delete(adminController.deleteCourse);
router.get('/manage/course/datatable',adminController.courseDatatable);
/**
 * get, edit, post, delete term
 */
router.route('/manage/term')
    .get(adminController.getTerms)
    .post(adminController.postTerm)
    .put(adminController.updateTerm)
    .delete(adminController.deleteTerm);

/**
 * get, edit, post, delete major
 */
router.route('/manage/major')
    .get(adminController.getMajors)
    .post(adminController.postMajor)
    .put(adminController.updateMajor)
    .delete(adminController.deleteMajor);

/**
 * get, edit, post, delete kindofnew
 */
router.route('/manage/kindofnew')
    .get(adminController.getKindOfNews)
    .post(adminController.postKindOfNew)
    .put(adminController.updateKindOfNew)
    .delete(adminController.deleteKindOfNew);
/**
 * get, edit, post, delete kindofnew
 */
router.route('/manage/new')
    .get(adminController.getNews)
    .delete(adminController.deleteNew);

/**
 * get, edit, post, delete kindofannouncement
 */
router.route('/manage/kindofannouncement')
    .get(adminController.getKindOfAnnouncements)
    .post(adminController.postKindOfAnnouncement)
    .put(adminController.updateKindOfAnnouncement)
    .delete(adminController.deleteKindOfAnnouncement);
router.get('/manage/kindofannouncement/datatable',adminController.kindOfAnnouncementDatatable);

/**
 * get, edit, post, delete announcement
 */
router.route('/manage/announcement')
    .get(adminController.getAnnouncement)
router.get('/manage/announcement/datatable',adminController.announcementDatatable);
module.exports = router;
