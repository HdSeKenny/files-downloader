const fs = require('fs');

const sweetsObj = require('./sweets.json');

const sweets = sweetsObj.sweets;
const exampleSweets = [];
const exampleUsers = [];
const readFilePromises = [];

const readFiles = (dirname, callback) => {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      throw new Error(err);
    }


    callback(filenames);
    // filenames.forEach((filename) => {
    //   readFilePromises.push(filePromise(dirname, filename));
    // });
    // Promise.all(readFilePromises).then(() => {

    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  });
};

const getfileName = (string) => {
  const pointIndex = string.indexOf('.');
  if (pointIndex < 1) {
    return '';
  }
  return pointIndex < 1 ? '' : string.substring(0, pointIndex);
};

const convertUserObject = (sweet)  => {
  const usrStrId = sweet.user.id_str;
  const fileNames = [];
  readFiles('images/', (filenames) => {
    filenames.forEach(stringName => {
      const fileName = getfileName(stringName);
      if (fileName) {

      }
    });
  });
};

convertUserObject();

// sweets.forEach((sweet, index) => {
//   convertUserObject();
// });
