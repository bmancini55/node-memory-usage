/**
 * Buffer.concat with Arrays
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
  let buffers = [];
  request
    .get(url)
    .on('data',  d => buffers.push(d))
    .on('error', e => cb(e))
    .on('end',  () => cb(null, Buffer.concat(buffers)));
}