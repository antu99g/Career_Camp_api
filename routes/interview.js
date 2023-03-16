const express = require('express');
const router = express.Router();

const auth = require("../middlewares/auth");

const interviewController = require('../controllers/interview_controller');

// Authentication for all routes
router.use(auth.verifyUser);


// Interview page route
router.get('/data', interviewController.allInterviews);

// Creating new interview
router.post('/create', interviewController.createInterview);

// Deleting interview
router.delete('/:id/delete', interviewController.deleteInterview);

// Setting interview status for a student
router.post('/status/set', interviewController.setInterviewStatus);

// Adding new student to an interview
router.post('/add-student', interviewController.addNewStudent);

// Downloading all interview details as csv
router.get('/log', interviewController.downloadInterviewLog);


module.exports = router;