const mongoose = require('mongoose')
const express = require('express')
const route = require('./Routes/route')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors()) 

mongoose.connect(
    "mongodb+srv://Manasvi29:bharat2909@cluster0.r7a9dpa.mongodb.net/order-management?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
)
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((error)=>console.log(error))
flag = false

// mongoose.connection.once(
//     "open",
//     ()=>{
//         if(flag == true){
//             adminCreation()
//         }
//     }
// ).on("error",(err)=>{})

app.use('/',route)

app.listen(process.env.PORT||5000, function(){
    console.log("Express app running on port " + (process.env.PORT || 5000))
})
