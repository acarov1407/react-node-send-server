const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const fileController = require('../controllers/fileController');
const { check } = require('express-validator');
const checkAuth = require('../middleware/auth');


router.route('/')
    .post(
        [
            check('real_name', 'Sube un archivo').not().isEmpty()
        ],
        checkAuth,
        linkController.createLink)
    .get(linkController.getAllLinks);

router.route('/link/:url')
    .post(linkController.checkPassword)
    .get(linkController.getLink)
    .delete(checkAuth, linkController.deleteLink, fileController.deleteFile)


router.get('/user', checkAuth, linkController.getUserLinks);

module.exports = router;