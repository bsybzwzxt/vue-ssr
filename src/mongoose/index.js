const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/puppeteer';

mongoose.connect(URL, {useNewUrlParser: true});

module.exports = mongoose;