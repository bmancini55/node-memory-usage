/**
 * Sized buffer, with offset insert
 */

let fs = require('fs');

setInterval(run, 1000);

function run() {
  fetchFile((err, buffer) => {
    console.log(err || process.memoryUsage());
  });
}

function fetchFile(cb) {
  let buffer;
  let offset = 0;
  let { size } = fs.lstatSync('fixtures/test.jpg')

  require('fs')
    .createReadStream('fixtures/test.jpg')
    .on('open', () => buffer = new Buffer(size))
    .on('data',  d => {
      for(let i = 0; i < d.length; i += 1) {
        buffer.writeUInt8(d[i], offset);
        offset += 1;
      }
    })
    .on('error', e => cb(e))
    .on('end', () => cb(null, buffer));
}