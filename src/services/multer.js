const multer =  require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

/*const storage = multer.diskStorage({
    destination: path.resolve("public/uploads"),
    filename: (req, file, cb)=>{
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});*/

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    /*dest: path.resolve("public/uploads"),
    limits: 2000000*/
});

module.exports = upload;