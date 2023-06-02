const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

router.post('/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Introduce un email válido').isEmail(),
        check('password', 'La contraseña debe tener por lo menos 6 caracteres').isLength({min: 6})
    ],
    userController.createUser);

module.exports = router;