/**
 * Sized buffer, with offset insert
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
  let buffer;
  let offset = 0;
  let byte;
  request
    .get(url)
    .on('response', (r) => {
      buffer = new Buffer(parseInt(r.headers['content-length']));
    })
    .on('data',  d => {
      for(byte of d) {
        buffer.writeUInt8(byte, offset);
        offset += 1;
      }
    })
    .on('error', e => cb(e))
    .on('end', () => cb(null, buffer));
}