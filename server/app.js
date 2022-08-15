const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Contact = require('./models/Contact');

const app = express();
app.use(express.json());
app.use(cors());
app.options('http://localhost:6060/', cors())

// database connection
const url = 'mongodb://localhost/';
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', () => console.error(error));
db.once('open', () => console.log('DB is connected'));

app.get('/', async (req, res) => res.send('Working'));

// routers
const usersRouter = require('./routers/users')
const contactsRouter = require('./routers/contacts');

app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);



app.listen('6060', () => console.log('Server is working...'));