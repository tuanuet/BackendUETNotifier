/* eslint-env node */
var mongoose    = require('mongoose');
var LopChinhSchema = mongoose.Schema({
    name:{
        required : true,
        type: String
    },
    master: {
        type: mongoose.Schema.ObjectId,
        ref : 'Lecturer'
    },
    faculty:{
        type: String,
        ref :'Faculty'
    }
},{
    timestamps : true,
    strict :true
})


module.exports = mongoose.model('MainClass',LopChinhSchema);

