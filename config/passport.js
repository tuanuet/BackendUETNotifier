/* eslint-env node */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
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