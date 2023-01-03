const express = require('express')
const {createUser,login, deleteUser} = require('../Controllers/userController')
const {authentication, authorization} = require('../Middleware/auth')
const router = express.Router()

router.post('/createUser/:admin',authentication,authorization,createUser)
router.post('/login',login)
router.delete('/deleteUser/:admin/:user',authentication,authorization,deleteUser)

module.exports = router