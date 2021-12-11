const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminAccount= Schema ({
    name:({
        type: String,
        require: true
    }),
    email: ({
        type: String,
        require: true
    }),
    password :({
        type: String,
        require: true
    }),
    status:String,
    date_created: String
})

const adminProfileSchema = mongoose.model ('admin', adminAccount);

module.exports = adminProfileSchema;