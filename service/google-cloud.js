const vision       = require('@google-cloud/vision'),
      textToSpeech = require('@google-cloud/text-to-speech')

const visionClient = new vision.ImageAnnotatorClient(),
      speechClient = new textToSpeech.TextToSpeechClient()

module.exports = {
  getText (filePath) {
    return new Promise(async (resolve, reject) => {
      try {
        const [ result ] = await visionClient.textDetection(filePath)

        const detections = result.textAnnotations,
              text       = detections.shift().description

        resolve(text)
      } catch (error) {
        reject(error)
      }
    })
  },
  getSpeech (text, lang) {
    return new Promise(async (resolve, reject) => {
      try {

        const request = {
          input: {
            text: text
          },
          voice: {
            languageCode: lang || 'pt-BR',
            ssmlGender: 'FEMALE'
          },
          // select the type of audio encoding
          audioConfig: {
            audioEncoding: 'MP3'
          }
        };

        const [ response ] = await speechClient.synthesizeSpeech(request)

        resolve(response.audioContent.toString('base64'))
      } catch (error) {
        reject(error)
      }
    })
  }
}
