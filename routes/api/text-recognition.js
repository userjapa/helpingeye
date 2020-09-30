const express = require('express'),
      fs      = require("fs"),
      path    = require('path')

const gcloud = require('./../../service/google-cloud')

const router = express.Router()

router.post('/', async (req, res) => {
  const data     = req.body.data.split(';base64,').pop(),
        fileName = `${Date.now()}-${req.headers['x-forwarded-for'] || req.connection.remoteAddress}.png`,
        filePath = path.resolve(__dirname, `../../files/${fileName}`)

  try {
    fs.writeFileSync(filePath, data, { encoding: 'base64' })

    const text = await gcloud.getText(filePath, data.lang)

    res.json({
      valid: true,
      data: {
        text
      }
    })
  } catch (error) {
    res.json({
      valid: false,
      data: {}
    })
  } finally {
    if (fs.existsSync(filePath))
      fs.unlinkSync(filePath)
  }
})

module.exports = router
