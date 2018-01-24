/* eslint-env node */
const express = require('express');
const router = express.Router();
import * as studentController from '../controllers/student';


router.post('/savetoken',studentController.saveToken);

router.get('/subscribe',studentController.getSubcribe);


module.exports = router;
