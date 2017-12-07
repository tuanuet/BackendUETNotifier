/* eslint-env node */
const express = require('express');
const router = express.Router();
import * as studentController from '../controllers/student';
import passport from 'passport';

router.post('/savetoken',(req,res,next) => {
    console.log(req.headers);
    passport.authenticate('jwt', {session: false})(req,res,next);
},studentController.saveToken);


module.exports = router;
