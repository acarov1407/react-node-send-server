const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const url = `${connection.connection.host}:${connection.connection.port}`;

        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;