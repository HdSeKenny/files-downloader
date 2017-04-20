const express = require('express');
const fs = require('fs');

const download = require('./download');

const data = { sweets: [] };
const readFilePromises = [];

const filePromise = (dirname, filename) => new Promise ((resolve, reject) => {
  fs.readFile(dirname + filename, 'utf-8', (err, content) => {
    if (err) {
      reject(err);
    }

    JSON.parse(content).forEach(sweet => {
      const pointIndex = filename.indexOf('.');
      sweet.tag = filename.substring(0, pointIndex);
      data.sweets.push(sweet);
    });
    resolve();
  });
});

function readFiles(dirname) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      console.log(err);
      return;
    }
    filenames.forEach((filename) => {
      readFilePromises.push(filePromise(dirname, filename));
    });
    Promise.all(readFilePromises).then(() => {
      const sweetsJson = JSON.stringify(data, null, 2);
      fs.writeFile('sweets.json', sweetsJson, 'utf8', () => {
        const downloadPromises = [];
        data.sweets.forEach(sweet => {
          const { user } = sweet;
          if (user.profile_background_image_url) {
            downloadPromises.push(download(user.profile_background_image_url))
          }
            profile_background_image_url
            profile_background_image_url_https
            profile_image_url
            profile_image_url_https
            profile_banner_url

        });
      });
    })
    .catch((error) => {
      console.log(error);
    })
  });
}


readFiles('json/');


