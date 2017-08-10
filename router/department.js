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
        callback(null,Date.now()+file.originalname)
    },
});
const upload = multer({storage});

router.route('/')
    .get(departmentController.getDashboard);

router.route('/announce/all')
    .get(departmentController.getAnnounceAll)
    .post(upload.single('file'),departmentController.postAnnounceAll);

router.route('/announce/class')
    .get()
    .post();
router.route('/announce/course')
    .get()
    .post();
router.route('/announce/student')
    .get()
    .post();

module.exports = router;
