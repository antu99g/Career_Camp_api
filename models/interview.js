const mongoose = require('mongoose');


const interviewSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    interviewDate: {
        type: String,
        required: true
    },
    students: [
        {
            candidate: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student'
            },
            interviewStatus: {
                type: String
            }
        }
    ]
});


const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;