const express = require('express')
const {createUser,login, deleteUser, createAdmin, getUser} = require('../Controllers/userController')
const {authentication, authorization} = require('../Middleware/auth')
const router = express.Router()

router.post('/register',createAdmin)
router.post('/createUser/:admin',authentication,authorization,createUser)
router.post('/login',login)
router.get('/getUsers/:admin',authentication,authorization,getUser)
router.delete('/deleteUser/:admin/:user',authentication,authorization,deleteUser)

module.exports = router