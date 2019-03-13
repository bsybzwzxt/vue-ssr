const mongoose = require('../mongoose/index');
const schema = mongoose.Schema;
const userSchema = new schema({

    account: {type: String, unique: true},
    password: String,

    name: String,
    phone: String,

    createTime: {type: Date, default: Date.now},
    updateTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
