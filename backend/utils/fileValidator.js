const path = require('path');

const validateFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ['.csv', '.xlsx'].includes(ext);
};

module.exports = { validateFile };