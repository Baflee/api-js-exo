require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const bookRoutes = require('./routes/book');

const origin = process.env.MONGODB_CONNECTIONSTRING;

const app = express();
app.use(express.json());

mongoose.connect(origin, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB !'))
.catch(() => console.log('Connexion to MongoDB failed !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
