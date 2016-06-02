/**
 * Stream
 */

let request = require('request');
let fs      = require('fs');

setInterval(run, 1000);

function run() {
  return fetchFile()
    .then(() => {
      console.log(process.memoryUsage());
    });
}

function fetchFile(url) {
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream('test.jpg');
    fs
      .createReadStream('fixtures/test.jpg')
      .on('error', reject)
      .on('end', resolve)
      .pipe(stream);
  });
}