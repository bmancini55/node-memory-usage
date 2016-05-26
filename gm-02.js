/**
 * File read to buffer
 */

const fs            = require('fs');
const graphicsMagic = require('gm');
const gm            = graphicsMagic.subClass({ imageMagick: true });

setInterval(run, 500);

function run() {
  const path = 'fixtures/test.jpg';
  readFileAsync(path)
  .then(buffer => Promise.all([
    resizeImage(buffer, 300),
    resizeImage(buffer, 400),
    resizeImage(buffer, 500),
    resizeImage(buffer, 600),
    resizeImage(buffer, 700),
    resizeImage(buffer, 800),
  ]))
  .then((output) => {
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

function resizeImage(buffer, width) {
  return new Promise((resolve, reject) => {
    gm(buffer)
    .resize(width)
    .toBuffer('JPG', (err, buffer2) => {
      if(err) reject(err);
      else    resolve(buffer2);
    });
  });
}
