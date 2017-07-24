/* eslint-env node */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.route('/dashboard')
    .get(adminController.getDashboard);
/**
 * edit, post, delete user
 */
router.route('/manage/:role')
    .get(adminController.getManagementAccount)
    .post(adminController.postAccount)
    .put(adminController.updateAccount)
    .delete(adminController.deleteAccount);

module.exports = router;
