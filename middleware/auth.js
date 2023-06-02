const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const checkAuth = async (req, res, next) => {

    if (req.cookies.token) {
        
        try {
            const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            const user = await User.findById(decodedToken._id).select("_id name email fileLimit");
            if (!user) return res.status(404).json({ msg: 'Token No Válido' });
            req.user = user;
        } catch (error) {
            if(error.name === 'TokenExpiredError') return res.status(401).json({msg: 'El token ha expirado', status: 'expired'});
            return res.status(404).json({ msg: "Hubo un error con el token", status: 'invalid' });
        }
    }

    return next();
}

module.exports = checkAuth;