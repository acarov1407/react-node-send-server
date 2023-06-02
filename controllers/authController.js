const User = require('../models/User');
const hashing = require('../helpers/hashing');
const generateJWT = require('../helpers/jwt');
const { validationResult } = require('express-validator');

exports.authUser = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error('El usuario no existe');
        return res.status(401).json({ msg: error.message });
    }

    const passMatch = hashing.checkPassword(password, user.password);
    if (!passMatch) {
        const error = new Error('Contraseña incorrecta');
        return res.status(401).json({ msg: error.message });
    }

    const clientUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        fileLimit: user.fileLimit
    }

    const token = generateJWT(clientUser);


    res.cookie('token', token, {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true, //Set false in development
        maxAge: 1000 * 60 * 60 * 24 * 1
    })

    
    return res.json(clientUser);
}

exports.getAuthUser = async (req, res) => {
    return res.json(req.user)
}

exports.logOut = async (req, res) => {

    if(!req.cookies?.token){
        return res.status(401).json({msg: 'No hay token'});
    }

    res.cookie('token', null, {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true, //Set false in development
        maxAge: 0
    })

    return res.json({ status: true });
}