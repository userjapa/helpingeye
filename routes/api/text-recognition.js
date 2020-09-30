const express = require('express'),
      fs      = require("fs"),
      path    = require('path')

const gcloud = require('./../../service/google-cloud')

const router = express.Router()

function deleteFile (filePath) {
  if (fs.existsSync(filePath))
    fs.unlinkSync(filePath)
}

router.post('/', async (req, res) => {
  const data     = req.body.data.split(';base64,').pop(),
        fileName = `${Date.now()}.png`,
        filePath = path.resolve(__dirname, `../../files/${fileName}`)

  try {
    fs.writeFileSync(filePath, data, { encoding: 'base64' })

    let speech = '',
        text   = await gcloud.getText(filePath)

    text = text.replace(/\u21b5/g,'. ').trim()

    if (text)
      speech = await gcloud.getSpeech(text, req.body.lang)

    res.json({
      valid: true,
      data: {
        speech
      }
    })
  } catch (error) {
    res.json({
      valid: false
    })
  } finally {
    deleteFile(filePath)
  }
})

module.exports = router
