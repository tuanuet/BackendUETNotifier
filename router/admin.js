/* eslint-env node */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.route('/dashboard')
    .get(adminController.getDashboard);
/**
 * edit, post, delete user
 */
router.route('/manage/account')
    .get(adminController.getManagementAccount)
    .post(adminController.postAccount)
    .put(adminController.updateAccount)
    .delete(adminController.deleteAccount);
/**
 * get, edit, post, delete class
 */
router.route('/manage/class')
    .get(adminController.getClasses)
    .post(adminController.postClass)
    .put(adminController.updateClass)
    .delete(adminController.deleteClass);

/**
 * get, edit, post, delete class
 */
router.route('/manage/course')
    .get(adminController.getCourses)
    .post(adminController.postCourse)
    .put(adminController.updateCourse)
    .delete(adminController.deleteCourse);
module.exports = router;
