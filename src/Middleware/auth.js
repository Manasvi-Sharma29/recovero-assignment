const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers.authorization || req.headers.Authorization;
    if(!token){
        return res
              .status(401)
              .send({status: false, message:"you're not logged in"})
    }
    token = token.split(" ")[1];
    jwt.verify(token, "order-management/we45@#%",function (err, decoded) {
      if (err)
        return res.status(401).send({ status: false, message: err.message });
      else {
        req.token = decoded;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};

const authorization = async function(req,res,next){
    try{
        let userId = req.params.admin
        const admin = await userModel.findById(userId)
        if(!admin){
            return res.status(404).send({ status: false, message:"user not found" });
        }
        if(userId !== req.token.userId || req.token.role !== "admin"){
            return res
              .status(403)
              .send({status: false, message:"You are not authorized to perform this task"})
        }
        next()
    }catch(error){
        return res.status(500).send({ status: false, Error: error.message });
    }
}

module.exports = {authentication, authorization}
