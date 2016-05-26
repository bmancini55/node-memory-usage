let amqp     = require('amqplib');
let request  = require('request');
let config   = {
  rabbitPath: '192.168.99.100'
};


(() => {
  console.log('connect to', config.rabbitPath);
  amqp
    .connect('amqp://' + config.rabbitPath)
    .then((broker) => broker.createChannel())
    .then(onChannel)
    .catch(console.log);

})();


function onChannel(channel) {
  console.log('connected to ', config.rabbitPath);

  // setup channel
  channel.assertExchange('app', 'fanout');
  channel.assertExchange('diamond', 'topic');
  channel.bindExchange('diamond', 'app', '');
  channel.assertQueue('diamond', { expires: 3600000 });
  channel.bindQueue('diamond', 'diamond', 'diamond.download.image');
  channel.consume('diamond', (msg) => onMsg(msg, channel));

  // start requests
  let buffer = convertToBuffer({ stock_no: 'STK687392' })
  setInterval(() => channel.publish('app', 'diamond.download.image', buffer), 5000);
}

function onMsg(msg, channel) {
  let correlationId = msg.properties.correlationId;

  // fetch the data from the transport
  let data = convertFromBuffer(msg.content);

  // processing message
  return handleDownload(data, channel, correlationId)
    .then(() => channel.ack(msg))
    .catch((ex) => {
      console.log(ex);
      channel.nack(msg, false, false);
    });

}

function handleDownload(data, channel, correlationId) {
  let { stock_no } = data;

  // connect to diamond and fetch the image
  return fetchFile('https://s3.amazonaws.com/southsidecomics/items/STK/687/392/STK687392.jpg')
    .then((image) => {
      emit('diamond.image.downloaded', { stock_no, image }, channel, correlationId);
      console.log(JSON.stringify(process.memoryUsage()) + ',');

      if(global.gc)
        global.gc();
    });

}

function emit(path, data, channel, correlationId) {
  channel.publish('app', path, data.image, { correlationId });
}


/**
 * Fetches a file from Diamond
 * @param  {[type]} options.url [description]
 * @param  {[type]} options.jar [description]
 * @return {Buffer}             [description]
 */
function fetchFile(url) {
  return new Promise((resolve, reject) => {

    // pipe the response
    let buffer;
    let offset = 0;
    request
      .get(url)
      .on('response', (r) => {
        buffer = new Buffer(parseInt(r.headers['content-length']));
      })
      .on('data',  d => {
        buffer.writeInt8(d, offset);
        offset += d.length;
      })
      .on('error', e => reject(e))
      .on('end', () => resolve(buffer));
  });
}



//// This stuff is bullshit below here and needs to be wacked
///
function convertToBuffer(result) {
  let type;
  let data;

  if(result instanceof Buffer) {
    type = 'buffer';
    data = result;
  }
  else if(typeof result === 'object') {
    type = 'object';
    data = new Buffer(JSON.stringify(result));
  }
  else {
    type = typeof result;
    data = new Buffer(result);
  }
  return Buffer.concat([ new Buffer(type), data ]);
};

function convertFromBuffer(buffer) {
  let text = buffer.toString();
  let result;

  if(text.startsWith('buffer')) {
    result = new Buffer(text.substring('buffer'.length));
  }
  else if(text.startsWith('object')) {
    result = text.substring('object'.length);
    result = JSON.parse(result);
  }
  else {
    result = text.substring('string'.length);
  }
  return result;
};