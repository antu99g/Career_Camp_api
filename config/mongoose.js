const mongoose = require('mongoose');

mongoose.connect(process.env.CAREER_CAMP_MONGODB_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error in connecting to db'));

db.once('open', () => {console.log('Successfully connceted to mongodb')});

module.exports = db;