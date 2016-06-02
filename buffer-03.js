/**
 * Array.push.apply
 */

setInterval(run, 1000);

function run() {
  fetchFile((err, buffer) => {
    console.log(err || process.memoryUsage());
  });
}

function fetchFile(cb) {
  let buffer = [];
  require('fs')
    .createReadStream('fixtures/test.jpg')
    .on('data',  d => buffer.push.apply(buffer, d))
    .on('error', e => cb(e))
    .on('end',  () => cb(null, new Buffer(buffer)));
}