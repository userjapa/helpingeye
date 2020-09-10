const tesseract = require('node-tesseract-ocr');

module.exports = {
  recognize (path, lang = 'por') {
    const options = {
      lang,
      psm: 11,
      oem: 3,
      env: {
        maxBuffer: 4096 * 4096
      }
    }

    return tesseract.recognize(path, options)
  }
}
