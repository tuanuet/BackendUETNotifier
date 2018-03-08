const express = require('express');
const router = express.Router();
import * as uploadController from '../controllers/upload';
const multer = require('multer');
import path from 'path';

const storageImages = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join(__dirname,'../uploads/images'));
    },
    filename : function (req, file, callback) {
        callback(null,Date.now()+file.originalname);
    },
});
const uploadImage = multer({storage: storageImages});

const storageFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join(__dirname,'../uploads/files'));
    },
    filename : function (req, file, callback) {
        callback(null,Date.now()+file.originalname);
    },
});
const uploadFile = multer({storage: storageFiles});


router.post('/image',
    uploadImage.single('image'),
    uploadController.postUploadImage);

router.post('/file',
    uploadFile.single('file'),
    uploadController.postUploadFile);

module.exports = router;