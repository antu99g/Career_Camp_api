const Interview = require('../models/interview');
const Student = require('../models/student');
const {Parser, transforms: { unwind }} = require('json2csv');
const { connections } = require('mongoose');


// Fetching data of all interviews
module.exports.allInterviews = async function (req, res) {
   try {
      let interviews = await Interview.find({}).populate({
         path: "students",
         populate: {
            path: "candidate",
         },
      });
      let students = await Student.find({});

      return res.status(200).json({
			success: true,
         interviews,
         students,
      });
   } catch (err) {
      return res.json({
         success: false,
         flag: "Error in fetching interviews",
         message: err,
      });
   }
};


// Creating new interview
module.exports.createInterview = async function(req, res){
	try{
		if (req.body.companyName && req.body.interviewDate) {
			let students = [];
		
			if(req.body.students.length > 0){
            // adding 'on hold' interview status (primary-status) for each student
            students = req.body.students.map((id) => {
               return { candidate: id, interviewStatus: "On hold" };
            });
         }
			
			req.body.students = students;
		
			const newInterview = await Interview.create(req.body);
		
			if (req.body.students.length > 0) {
				for (let i of req.body.students) {
					const student = await Student.findById(i.candidate);
					student.allInterview.push({
						company: newInterview._id,
						interviewStatus: "On hold",
					});
					student.save();
				}
			}

			await newInterview.populate({
            path: "students",
            populate: {
               path: "candidate",
            },
         });
			
			return res.status(200).json({
            success: true,
            newInterview,
         });
		}
		
      throw new Error("Didn't get sufficient data");
	}catch(err){
      return res.json({
         success: false,
         flag: "Error in adding new interview",
         message: err,
      });
	}
}


// Deleting interview
module.exports.deleteInterview = async function(req, res){
   try{
      await Interview.findByIdAndDelete(req.params.id);
      return res.status(200).json({
         success: true,
         message: "Interview deleted successfully",
      });      
   } catch(err) {
      return res.json({
         success: false,
         flag: "Error in deleting interview",
         message: err,
      });
   }
}


// Setting interview-status
module.exports.setInterviewStatus = async function(req, res){
	try{
		await Interview.updateOne(
			{ '_id': req.body.interviewId, "students.candidate": req.body.studentId },
			{
				$set: {
				"students.$.interviewStatus": req.body.interviewStatus,
				},
			}
		  );
	
		if (req.body.interviewStatus == 'Pass'){
			await Student.updateOne({ _id: req.body.studentId }, {placementStatus: 'Placed'});
		}
	
		await Student.updateOne(
			{ _id: req.body.studentId, "allInterview.company": req.body.interviewId },
			{
				$set: {
					"allInterview.$.interviewStatus": req.body.interviewStatus,
				},
			}
		);
		
		return res.status(200).json({
         success: true,
         studentId: req.body.studentId,
         newStatus: req.body.interviewStatus,
      });

	}catch(err){
      return res.json({
         success: false,
         flag: "Error in setting interview status",
         message: err,
      });
	}
}


// Adding new student to an interview
module.exports.addNewStudent = async function(req, res){
	try{
		if (req.body.studentId) {
	
			let interview = await Interview.findById(req.body.interviewId);
			
			let newStudent = interview.students.filter(s => s.candidate == req.body.studentId);
		
			if(newStudent.length == 0){		
				interview.students.push({
					candidate: req.body.studentId,
					interviewStatus: 'On hold'
				});
		
				interview.save();
		
				let student = await Student.findById(req.body.studentId);
	
				student.allInterview.push({
					company: interview._id,
					interviewStatus: 'On hold'
				});
		
				student.save();

				return res.status(200).json({
               success: true,
               newStudent: { candidate: student, interviewStatus: "On hold" }
            });
			}
		}
		else {
			throw new Error("Didn't get sufficient data");
		}
	}catch(err){
      return res.json({
         success: false,
         flag: "Error in adding new student",
         message: err,
      });
	}

}


// Download all interview data as csv
module.exports.downloadInterviewLog = async function(req, res){
	try{
		let interviews = await Interview.find({}).populate({
			path: "students",
			populate: {
				path: "candidate",
			},
		});

		let newInterviewList = [];

		for(let i of interviews){
			let interview = {
            companyName: i.companyName,
            interviewDate: i.interviewDate,
            students: i.students.map((student) => {
               return {
                  candidate: student.candidate.name,
                  interviewStatus: student.interviewStatus,
               };
            }),
         };
			newInterviewList.push(interview);
		}

		const fields = [
         { label: "Company Name", value: "companyName" },
         { label: "Interview Date", value: "interviewDate" },
         { label: "Candidate", value: "students.candidate" },
         { label: "Status", value: "students.interviewStatus" }
      ];	
      const transforms = [unwind({ paths: ["students"], blankOut: true })];
	
		const json2csvParser = new Parser({ fields, transforms });
		const csv = json2csvParser.parse(newInterviewList);
	
		return res.status(200).json({
         success: true,
         file: csv,
      });
		
	}catch(err){
      return res.json({
         success: false,
         flag: "Error in downloading file",
         message: err,
      });
	}
}