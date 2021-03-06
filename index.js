/* eslint-disable all, no-param-reassign */
const mongodb = require('mongodb');
const fs = require('fs');

const download = require('./download');

const ObjectID = mongodb.ObjectID;
const data = { sweets: [], users: [] };
const readFilePromises = [];

const filePromise = (dirname, filename) => new Promise((resolve, reject) => {
  fs.readFile(dirname + filename, 'utf-8', (err, content) => {
    if (err) {
      reject(err);
    }
    const sweets = JSON.parse(content).sweets;
    sweets.forEach(sweet => {
      const pointIndex = filename.indexOf('.');
      sweet.tag = filename.substring(0, pointIndex);
      sweet.type = 'moments';
      sweet._id = ObjectID(sweet.id_str);
      sweet.show_comments = false;
      sweet.likers = [];
      sweet.comments = [];
      sweet.author = ObjectID(sweet.user.id_str);
      sweet.user._id = ObjectID(sweet.user.id_str);
      data.sweets.push(sweet);
      data.users.push(sweet.user);
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

    Promise.all(readFilePromises)
      .then(() => {
        const downloadPromises = [];
        data.sweets.forEach((sweet, index) => {
          const { user } = sweet;
          const userImagesObject = {
            id: user.id,
            id_str: user.id_str
          };

          if (user.profile_background_image_url) {
            const fileFormat = getFileFormatByUrl(user.profile_background_image_url);
            const download_image_url = `images/${user.id_str}${fileFormat}`;
            downloadPromises.push(download(user.profile_background_image_url, download_image_url));
            userImagesObject.profile_background_image_url = download_image_url;
          }

          if (user.profile_image_url) {
            const fileFormat = getFileFormatByUrl(user.profile_image_url);
            const download_image_url = `images/${user.id_str}${fileFormat}`;
            downloadPromises.push(download(user.profile_image_url, download_image_url));
            userImagesObject.profile_image_url = download_image_url;
          }

          data.user_images.push(userImagesObject);
        })


      })
      .catch((error) => {
        console.log(error);
      });

      Promise.all(downloadPromises).then(() => {
        const sweetsJson = JSON.stringify(data, null, 2);
        fs.writeFile('sweets.json', sweetsJson, 'utf8', () => {
          console.log(data.user_images.length);
          console.log('\ndone...');
        })
      })
      .catch((error) => {
        console.log(error)
      })
    })
    .catch((error) => {
      console.log(error);
    })
  });
}

// function getFileFormatByUrl(url) {
//   let format = '.png';
//   const lastPointIndex = url.lastIndexOf('.');
//   const lastSlashIndex = url.lastIndexOf('/');
//   if (lastPointIndex && lastSlashIndex && lastSlashIndex < lastPointIndex) {
//     format = url.substring(lastPointIndex);
//   }

//   return format;
// }


readFiles('json/');
