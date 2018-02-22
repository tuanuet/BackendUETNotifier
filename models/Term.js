/* eslint-env node */
const mongoose = require('mongoose');

const KiHocSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }

},{
    timestamps : true
});

module.exports = mongoose.model('Term',KiHocSchema);

