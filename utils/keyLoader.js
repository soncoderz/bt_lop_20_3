const fs = require('fs');

function loadPemKey(options) {
  const envValue = process.env[options.envName];
  if (envValue) {
    return envValue.replace(/\\n/g, '\n');
  }

  if (options.filePath && fs.existsSync(options.filePath)) {
    return fs.readFileSync(options.filePath);
  }

  throw new Error(`Missing ${options.label}. Set ${options.envName} or mount ${options.filePath}.`);
}

module.exports = {
  loadPemKey
};
