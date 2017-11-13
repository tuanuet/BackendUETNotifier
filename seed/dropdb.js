import mongoose from 'mongoose';
const dotenv = require('dotenv');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.exam' });

/* Connect to the DB */
mongoose.connect(process.env.MONGODB_URI,function(){
    /* Drop the DB */
    mongoose.connection.db.dropDatabase()
        .then(deleted => {
            console.log(deleted);
            process.exit(0);
        }).catch(console.log);
});