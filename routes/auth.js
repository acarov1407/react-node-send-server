const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const checkAuth = require('../middleware/auth');

router.post('/',
    [
        check('email', 'Introduce un email válido').isEmail(),
        check('password', 'La contraseña debe tener por lo menos 6 caracteres').isLength({min: 6})
    ],
    authController.authUser);
    
router.get('/', checkAuth, authController.getAuthUser);

router.post('/logout', authController.logOut);

module.exports = router;