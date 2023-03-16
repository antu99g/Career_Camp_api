const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.verifyUser = async function (req, res, next) {
   try {
      const bearerHeader = req.headers['authorization'];
      let bearer = bearerHeader.split(" ");
      let bearerToken = bearer[1];
      const decoded = jwt.verify(bearerToken, process.env.CAREER_CAMP_JWT_SECRET);
      const user = await User.findById(decoded.employeeId);
      if (user) {
         req.employeeId = user._id;
         next();
      } else {
         throw new Error('User not found');
      }

   } catch (err) {
      return res.status(403).json({
         success: false,
         flag: "You are not authorized to access this page",
         message: err,
      });
   }
};