/* eslint-env node */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');

const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
var methodOverride = require('method-override');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dataTable = require('mongoose-datatable');
mongoose.plugin(dataTable.init);
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });
/**
 * API keys and Passport configuration.
 */
const middlewarePassport = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI,{useMongoClient: true,poolSize:10});
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

/**
 * initial Schema for mongodb
 */
require('./models/index');
/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs',require('ejs-locals'));
app.set('view engine', 'ejs');
app.use(expressStatusMonitor());
app.use(compression());
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true ,parameterLimit: 1000000 }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
        autoReconnect: true,
        clear_interval: 3600
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {
//   if (req.path === '/api/upload') {
//     next();
//   } else {
//     lusca.csrf()(req, res, next);
//   }
// });
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
    if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
      req.path === '/account') {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'uploads')));

/**
 * Router
 */
const admin = require('./router/admin');
const department = require('./router/department');
const faculty = require('./router/faculty');
const lecturer = require('./router/lecturer');
const user = require('./router/user');
const api = require('./router/api');
const student = require('./router/student');
app.get('/',middlewarePassport.isAuthenticated, (req,res) => {
    res.render('index', {
        title : 'Home'
    });
});

app.use('/admin',admin);
app.use('/department',department);
app.use('/lecturer',lecturer);
app.use('/faculty',faculty);
app.use('/user',user);
app.use('/api',api);
app.use('/student',passport.authenticate('jwt', {session: false}),student);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), async () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
    if(process.argv[2] === 'seed'){
        await require('./seed/factory.seed');
        await require('./seed/priority.seed').seed();
        await require('./seed/kindAnnouncement.seed').seed();
        // await require('./seed/new.seed').seed();
    }

});

module.exports = app;
