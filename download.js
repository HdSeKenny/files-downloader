const fs = require('fs');
const request = require('request');
const progress = require('request-progress');
const readline = require('readline');

const downloadPromise = (uri, filename) => new Promise ((resolve, reject) => {
  request.head(uri, (err, res, body) => {
    if (err) { reject(err); }

    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    const fileSize = res.headers['content-length'];
    let dataSize = 0;
    request(uri)
      .on('data', (data) => {
        dataSize += data.length;
        const percentage = ((dataSize / fileSize) * 100).toFixed(1);
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Downloading: ${percentage}%`);
      })
      .on('error', (err) => {
        console.log(uri, filename)
        reject(err)
      })
      .pipe(fs.createWriteStream(filename)).on('close', () => {
        resolve();
      });
  });
})

const download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    if (err) { throw err; }

    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    const fileSize = res.headers['content-length'];
    let dataSize = 0;
    request(uri)
      .on('data', (data) => {
        dataSize += data.length;
        const percentage = ((dataSize / fileSize) * 100).toFixed(1);
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Downloading: ${percentage}%`);
      })
      .on('error', (err) => {
        // Do something with err
      })
      .pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


// downloadPromise('https://www.google.com/images/srpr/logo3w.png', 'google.png')
//   .then(() => {
//     console.log('\ndone');
//   })

module.exports = downloadPromise;