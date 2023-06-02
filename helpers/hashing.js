const bcrypt = require('bcrypt');

exports.hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
}

exports.checkPassword = (passPlain, passHashed) => {
    return bcrypt.compareSync(passPlain, passHashed);
}