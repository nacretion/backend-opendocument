const express = require('express')
const documentController = require("../controllers/document.controller")

const router = express.Router()


router.post('/document-template', documentController.saveDocument)


module.exports = router