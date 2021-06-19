const multer = require("multer");
const fs = require('fs-extra');

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image.gif": "gif",
  "image.webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let path = `./upload/${req.body.typeFile}s`; // typeFile can be 'user' or 'post'
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename: (req, file, callback) => {
    const name = req.body.typeFile == "user" ? 
      "user-" + req.body.userId + "_" + file.originalname.replace(/\.[^/.]+$/, "") :
      file.originalname.replace(/\.[^/.]+$/, "") ;
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
module.exports = multer({ storage: storage }).single("image"); 
