const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const {isValidEmail,isValidName,isValidPassword,isValidPhone } = require("../validator");

const createUser = async function (req, res) {
  try {
    let {title, name, email, password, role, phone } = req.body;
    let obj = {};
    if(!title){
      return res
        .status(400)
        .send({ status: false, message: "title is a required field" });
    }
    if(!["Mr","Mrs","Miss"].includes(title)){
      return res
        .status(400)
        .send({ status: false, message: "enter valid title" });
    }
    obj["title"] = title
    if(!["admin","member"].includes(role)){
      role = "member"
    }
    if (role == "admin") {
      role = "member";
    }
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "name is a required field" });
    }
    if (!isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid name" });
    }
    obj["name"] = name;
    const isDuplicate = await userModel.findOne({$or:[{email:email},{phone:phone}]})
    if(isDuplicate){
      return res
              .status(409)
              .send({status: false, message:"email or phone already in use"})
    }
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is a required field" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid mail" });
    }
    obj["email"] = email;
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required field" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid password" });
    }
    obj["password"] = password;
    const encryptPassword = await bcrypt.hash(password, 10);
    obj["codedPassword"] = encryptPassword;
    if (!role) {
      return res
        .status(400)
        .send({ status: false, message: "role is required" });
    }
    obj["role"] = role;
    if (!phone) {
      return res
        .status(400)
        .send({ status: false, message: "phone number is required" });
    }
    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid phone number" });
    }
    obj["phone"] = phone;
    obj["createdBy"] = req.user
    await userModel.create(obj);
    let result = await userModel.find({role:"member",isDeleted:false, createdBy:req.user})
    for(i=0; i<result.length; i++){

      delete result[i]._doc.codedPassword
    }
    return res.status(201).send({
      status: true,
      message: "User Creation Successful",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ Error: error.message });
  }
};

const createAdmin = async function (req, res) {
  try {
    let { title,name, email, password, role, phone } = req.body;
    let obj = {};
    if(!title){
      return res
        .status(400)
        .send({ status: false, message: "title is a required field" });
    }
    if(!["Mr","Mrs","Miss"].includes(title)){
      return res
        .status(400)
        .send({ status: false, message: "enter valid title" });
    }
    obj["title"] = title
    if(!["admin","member"].includes(role)){
      role = "admin"
    }
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "name is a required field" });
    }
    if (!isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid name" });
    }
    obj["name"] = name;
    const isDuplicate = await userModel.findOne({$or:[{email:email},{phone:phone}]})
    if(isDuplicate){
      return res
              .status(409)
              .send({status: false, message:"email or phone already in use"})
    }
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is a required field" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid mail" });
    }
    obj["email"] = email;
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required field" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid password" });
    }
    obj["password"] = password;
    const encryptPassword = await bcrypt.hash(password, 10);
    obj["codedPassword"] = encryptPassword;
    if (!role) {
      return res
        .status(400)
        .send({ status: false, message: "role is required" });
    }
    obj["role"] = role;
    if (!phone) {
      return res
        .status(400)
        .send({ status: false, message: "phone number is required" });
    }
    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid phone number" });
    }
    obj["phone"] = phone;
    let result = await userModel.create(obj);
    delete result._doc.codedPassword
    return res.status(201).send({
      status: true,
      message: "User Creation Successful",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ Error: error.message });
  }
};

const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is a required field" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is a required field" });
    }
    let user = await userModel.findOne({
      email: email,
      isDeleted:false
    });

    if (!user)
      return res.status(404).send({
        status: false,
        message: "User Not Found",
      });
    const match = await bcrypt.compare(password, user.codedPassword);
    if (!match) {
      return res
        .status(400)
        .send({ status: false, message: "Entered Passwrod is incorrect" });
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      "order-management/we45@#%",
      { expiresIn: "24h" }
    );
    res.header("x-api-key", token);
    return res.status(200).send({
      status: true,
      message: "User login successful",
      data: { userId: user._id, token: token, role: user.role },
    });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};

const deleteUser = async function(req,res){
  try{
    const userId = req.params.user
    let deleted = await userModel.findOneAndUpdate({_id:userId},{$set:{isDeleted:true}})
    if(!deleted){
      return res
              .status(404)
              .send({status: false, message:"User not found"})
    }
    return res
              .status(200)
              .send({status: true, message:"User deleted Successfully"})
  }catch(error){
    return res.status(500).send({ status: false, Error: error.message });
  }

}

module.exports = { createUser, login, createAdmin, deleteUser };
