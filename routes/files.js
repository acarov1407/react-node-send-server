const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const checkAuth = require('../middleware/auth');

router.post('/',
    checkAuth,
    fileController.uploadFile);

router.get('/:file', fileController.downloadFile, fileController.deleteFile);

module.exports = router;