
console.log('Hello world');

let v8 = require('v8');
console.log(process.memoryUsage());
console.log(v8.getHeapStatistics());
console.log(v8.getHeapSpaceStatistics());