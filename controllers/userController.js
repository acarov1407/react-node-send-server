const User = require('../models/User');
const hashing = require('../helpers/hashing');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {

    //Express Validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const user = new User(req.body);

        //Hash Password
        user.password = await hashing.hashPassword(password);
        await user.save();
        return res.json({ msg: 'Usuario creado correctamente' });
    } catch (ex) {
        const error = new Error('Ha ocurrido un error al intentar registrar el usuario');
        return res.status(400).json({ msg: error.message });

    }
}

exports.changeUserFileLimit = async (req, res, data) => {
    try {
        const user = await User.findById(data._id);
        if (data.isAdding) user.fileLimit += 1;
        else user.fileLimit -= 1;
        await user.save();
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Ha ocurrido un error al actualizar los datos del usuario' });
    }
}