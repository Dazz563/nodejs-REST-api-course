// Core node Packages
const path = require('path');
// Third party Packages
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
// Database Packages
const mongoose = require('mongoose');

// Import Routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

// Configuring Multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// We need body-parser to extract the json data for our controllers to use
app.use(bodyParser.json());
// Registering Multer
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
// Serving static images
app.use('/images', express.static(path.join(__dirname, 'images')));
// Setting CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

// Forward Routes through express
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Custom error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data,
    });
});

mongoose
    .connect(
        'mongodb+srv://darren-user:jpmpNIJHLvEA0UVu@cluster0.2yyh4.mongodb.net/messages_db?retryWrites=true&w=majority'
    )
    .then((result) => {
        app.listen(8080);
    })
    .catch((err) => console.log(err));
