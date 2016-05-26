
const fs = require('fs')
const path = 'fixtures/test.jpg';

setInterval(run, 500);

function run() {
  readFileAsync(path)
  .then(file => createObjectBuffer(path, file))
  .then(buffer => {
    let result = JSON.parse(buffer.toString());
    result.buffer = new Buffer(result.buffer, 'base64');
    console.log(process.memoryUsage());

    if(global.gc)
      global.gc();
  });
}

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if(err) reject(err);
      else    resolve(buffer);
    });
  });
}

function createObjectBuffer(path, buffer) {
  let json   = JSON.stringify({ path, buffer: buffer.toString('base64') });
  let result = new Buffer(json);
  return result;
}


