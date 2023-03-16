const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    dsaScore: {
        type: Number
    },
    webdScore: {
        type: Number
    },
    reactScore: {
        type: Number
    },
    placementStatus: {
        type: String
    },
    allInterview: [
        {
            company: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Interview'
            },
            interviewStatus: {
                type: String,
                ref: 'Interview'
            }
        }
    ]
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;