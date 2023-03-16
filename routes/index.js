const express = require('express');
const router = express.Router();

const auth = require("../middlewares/auth");

const studentsController = require('../controllers/student_controller');


// Home page route (students)
router.get("/students/data", auth.verifyUser, studentsController.allStudents);

// Adding new student
router.post("/student/add", auth.verifyUser, studentsController.addStudent);

// Deleting student
router.delete("/student/:id/delete", auth.verifyUser, studentsController.deleteStudent);

// Downloading all student details as csv
router.get("/students/log", auth.verifyUser, studentsController.downloadStudentsLog);



router.use('/user', require('./user'));

router.use('/interview', require('./interview'));


module.exports = router;