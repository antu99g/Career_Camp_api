const User = require('../models/user');
const jwt = require("jsonwebtoken");


// Adding new user
module.exports.signUp = async function (req, res) {
   try {      
      if(req.body.employeeId && req.body.password){
         let user = await User.findOne({ employeeId: req.body.employeeId });

         if (user) {      
            // if user already registered   
            return res.status(208).json({
               success: true,
               message: "User already registered",
               userid: user._id,
            });
         } else {
            const newUser = await User.create(req.body);
            return res.status(200).json({
               success: true,
               userid: newUser._id
            });
         }
      }

      throw new Error("Insufficiant data");
   } catch (err) {
      return res.json({
         success: false,
         flag: "Error in username or password",
         message: err
      });
   }
};


// Rendering login-page
module.exports.login = async function (req, res) {
   try {
      let user = await User.findOne({ employeeId: req.body.employeeId });

      if (user && user.password == req.body.password) {
         // generating new jwt
         const token = jwt.sign({ employeeId: user._id }, process.env.CAREER_CAMP_JWT_SECRET);

         return res.status(200).json({
            success: true,
            token,
         });
      }

      throw new Error('User not found');
   } catch (err) {
      return res.json({
         success: false,
         flag: "Error in username or password",
         message: err,
      });
   }
};