/**
 * Stream
 */

let request = require('request');
let fs      = require('fs');

setInterval(run, 10000);

function run() {
  return fetchFile('https://s3.amazonaws.com/southsidecomics/items/STK/687/392/STK687392.jpg')
    .then(() => {
      console.log(process.memoryUsage());
    });
}

function fetchFile(url) {
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream('test.jpg');
    request
      .get(url)
      .on('error', reject)
      .on('end', resolve)
      .pipe(stream);
  });
}