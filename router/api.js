/* eslint-env node */
import passport from 'passport';

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api');
const multer = require('multer');
import path from 'path';
import * as passportMiddleware from '../config/passport';
const userController = require('../controllers/user');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join(__dirname,'../uploads/api'));
    },
    filename : function (req, file, callback) {
        callback(null,Date.now()+file.originalname);
    },
});
const upload = multer({storage});

router.route('/loaitintuc')
    .get(apiController.getKindOfNews);
router.route('/loaithongbao')
    .get(apiController.getKindOfAnnouncements);
router.route('/mucdothongbao')
    .get(apiController.getPriorities);

router.get('/thongbao/:id',apiController.getAnnouncementById);
router.get('/avatar/:userId',apiController.getAvatarByUserId);
/**
 * Primary router smartPhone.
 */
router.post('/authenticate', userController.postAuthenticate);
router.post('/logout',passport.authenticate('jwt', {session: false}),passportMiddleware.mobileIsAuthenticated,apiController.postLogout);
router.get('/news',apiController.getNewsPagination);
router.get('/new/detail',apiController.getDetailNew);
router.get('/courses',passport.authenticate('jwt', {session: false}),passportMiddleware.mobileIsAuthenticated,apiController.getCourse);
router.get('/mark/:idCourse',passport.authenticate('jwt', {session: false}),passportMiddleware.mobileIsAuthenticated,apiController.getMark);
module.exports = router;
