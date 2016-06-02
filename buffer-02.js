/**
 * Buffer.concat with Buffers
 */

setInterval(run, 1000);

function run() {
  fetchFile((err, buffer) => {
    console.log(err || process.memoryUsage());
  });
}

function fetchFile(cb) {
  let buffers = [];
  require('fs')
    .createReadStream('fixtures/test.jpg')
    .on('data',  d => buffers.push(new Buffer(d)))
    .on('error', e => cb(e))
    .on('end',  () => cb(null, Buffer.concat(buffers)));
}