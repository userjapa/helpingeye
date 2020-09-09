const tesseract = require('node-tesseract-ocr');

module.exports = {
  recognize (path, lang = 'por') {
    const options = {
      lang,
      psm: 4,
      oem: 3
    };

    return tesseract.recognize(path, options)
  }
}
