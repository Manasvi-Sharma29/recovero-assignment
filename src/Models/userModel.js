const mongoose = require('mongoose')
// const objectId = mongoose.Schema.Types.ObjectId
const userSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        enum:["Mr","Miss","Mrs"]
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:15
    },
    codedPassword:{
        type:String,
        required:true,
        max:100
    },
    role:{
        type: String,
        required: true,
        enum: ["admin","member"],
        default:"member"
    },
    phone:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:String
    }
},{timestamps:true})

module.exports = mongoose.model('user',userSchema)