const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJWT = (user) => {
    const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '8h'
    });

    return token;
}

module.exports = generateJWT;