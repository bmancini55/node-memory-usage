/**
 * Array.push.apply
 */

let request = require('request');

setInterval(run, 5000);

function run() {
  fetchFile('https://s3.amazonaws.com/southsidecomics/items/STK/687/392/STK687392.jpg', (err, buffer) => {
    console.log(buffer.length);
    console.log(process.memoryUsage());
  });
}

function fetchFile(url, cb) {
  let buffer = [];
  request
    .get(url)
    .on('data',  d => buffer.push.apply(buffer, d))
    .on('error', e => cb(e))
    .on('end',  () => cb(null, new Buffer(buffer)));
}