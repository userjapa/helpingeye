const tesseract = require('node-tesseract-ocr');

module.exports = {
  recognize (path, lang = 'por') {
    const options = {
      lang
    }

    return tesseract.recognize(path, options)
  }
}
