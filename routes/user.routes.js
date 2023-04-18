const express = require('express')
const userController = require("../controllers/user.controller")

const router = express.Router()


router.post('/register', userController.create)
router.post('/auth', userController.auth)


module.exports = router