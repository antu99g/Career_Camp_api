const Student = require('../models/student');
const Interview = require("../models/interview");
const { Parser } = require("json2csv");


// Fetching data of all students
module.exports.allStudents = async function (req, res) {
   try {
      let students = await Student.find({});

      return res.status(200).json({
         success: true,
         students
      });
   } catch (err) {
      return res.json({
         success: false,
         flag: "Error in fetching students",
         message: err,
      });
   }
};


// Adding new student
module.exports.addStudent = async function(req, res){
   try{
      if (req.body.name && req.body.batch && req.body.college) {
         req.body.allInterview = [];
         const newStudent = await Student.create(req.body);         
         req.body.studentId = newStudent._id;
         return res.status(200).json({
            success: true,
            student: newStudent,
         });
      }

      throw new Error("Didn't get sufficient data");
   } catch(err) {
      return res.json({
         success: false,
         flag: "Error in adding new student",
         message: err,
      });
   }
}


// Deleting student
module.exports.deleteStudent = async function(req, res){
   try{
      await Student.findByIdAndDelete(req.params.id);
      await Interview.updateMany(
         {},
         { $pull: { students: { candidate: req.params.id } }},
         {safe: true, multi: true}
      );
      
      return res.status(200).json({
         success: true,
         message: 'Student deleted successfully'
      });      
   } catch(err) {
      return res.json({
         success: false,
         flag: "Error in deleting student",
         message: err,
      });
   }
}


// Download all students data as csv
module.exports.downloadStudentsLog = async function(req, res){	
   try{
      let students = await Student.find({});

      // Removing ',' from date to include in csv
      students = students.map((student) => {
         student.batch = student.batch.replace(',', '_');
         student.batch = student.batch.replace(' ', '');
         return student;
      });
      
      const fields = ['name', 'batch', 'college', 'dsaScore', 'webdScore', 'reactScore', 'placementStatus'];      
      
      const csvParser = new Parser({fields});
      const csv = csvParser.parse(students);
      
      return res.status(200).json({
         success: true,
         file: csv
      });

   }catch(err){
      return res.json({
         success: false,
         flag: "Error in downloading file",
         message: err,
      });
   }
}