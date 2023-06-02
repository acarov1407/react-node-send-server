//File Upload
const shortid = require("shortid");
const multer = require('multer');

const BASE_LIMIT = 1000000 //1MB
const getUpload = (req, res) => {
    const config = {
        limits: { fileSize: req.user ? BASE_LIMIT * 10 : BASE_LIMIT }, //1MB Limit for non registered //10MB Limit for registered
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.split('.').slice(-1)[0];
                cb(null, `${shortid.generate()}.${extension}`)
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'video/mp4') {
                    return cb(null, true);
                }
            }
        })
    }


    const upload = multer(config).single('file');
    return upload;
}

module.exports = getUpload;