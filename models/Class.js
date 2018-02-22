/* eslint-env node */
var mongoose    = require('mongoose');
var LopChinhSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        required : true,
        type: String
    },
    master: {
        type: mongoose.Schema.ObjectId,
        ref : 'Lecturer'
    }
},{
    timestamps : true,
    strict :true
});


module.exports = mongoose.model('Class',LopChinhSchema);

