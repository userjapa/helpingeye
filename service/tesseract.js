const tesseract = require('node-tesseract-ocr');

module.exports = {
  recognize (path, lang = 'por') {
    const options = {
      lang,
      psm: 6,
      env: {
        maxBuffer: 4096 * 4096
      }
    };

    return tesseract.recognize(path, options)
  }
}
