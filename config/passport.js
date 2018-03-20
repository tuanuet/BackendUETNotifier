/* eslint-env node */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const MobileDetect = require('mobile-detect');
require('dotenv').load({ path: '.env' });

const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }

        if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
        }
        user.comparePassword(password)
            .then(isMatch => {
                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, { msg: 'Invalid email or password.' });
            }).catch(done);
    });
}));

let opts = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : process.env.SESSION_SECRET
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({_id: jwt_payload._doc._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));


/**
 * Login Required middleware.
 */
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('errors','You don\'t have permission');
    res.redirect('/user/login');
};
const test = 'Mozilla/5.0 (Linux; U; Android 4.0.3; en-in; SonyEricssonMT11i' +
    ' Build/4.1.A.0.562) AppleWebKit/534.30 (KHTML, like Gecko)' +
    ' Version/4.0 Mobile Safari/534.30';
export const detectClientAuthenticated = (req,res,next) => {
    const md = new MobileDetect(req.headers['user-agent']);
    if(md.mobile()){
        return passport.authenticate('jwt',{session: false})(req,res,next);
    }
    return isAuthenticated(req,res,next);
};
export const validateAuthenticated = (req,res,next) => {
    const md = new MobileDetect(test||req.headers['user-agent']);
    if(md.mobile()){
        return isAuthenticated(req,res,next);
    }
    return next();
};
/**
 * Login Required middleware.
 */
export const mobileIsAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        message: 'Error authenticate!'
    });
};


export const reqIsAdmin= function (req,res,next) {
    if (req.user.role === 'Admin')
        return next();
    req.flash('errors','You don\'t have permission');
    res.redirect('/user/login');
};

export const reqIsLecture = function (req,res,next) {
    if (req.user.role === 'Lecturer')
        return next();

    req.flash('errors','You don\'t have permission');
    res.redirect('/user/login');
};
export const reqIsDepartment = function (req,res,next) {
    if (req.user.role === 'Department')
        return next();

    req.flash('errors','You don\'t have permission');
    res.redirect('/user/login');

};
export const reqIsFaculty = function (req,res,next) {
    if (req.user.role === 'Faculty')
        return next();
    req.flash('errors','You don\'t have permission');
    res.redirect('/user/login');

};