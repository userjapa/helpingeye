const express = require('express')

const textRecognition = require('./text-recognition')

const router = express.Router()

router.use('/text-recognition', textRecognition)

module.exports = router
