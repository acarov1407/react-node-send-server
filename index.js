const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const corsOptions = require('./config/cors');
const cookieParser = require('cookie-parser');

const app = express();

//Enable cookies
app.use(cookieParser())

//Enable Cors
app.use(cors(corsOptions))


//Enable data reading
app.use(express.json())

connectDB();

//Enable Public Folder
app.use(express.static(__dirname + '/uploads'));

const PORT = process.env.PORT || 4000;

app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/links', require('./routes/links'))
app.use('/api/files', require('./routes/files'))

app.listen(PORT, () => {
    console.log('Servidor iniciado en el puerto ', PORT);
})