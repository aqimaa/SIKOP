// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const allRoutes = require('./routes/indexRoutes.js');

// Initialize app
const app = express();

// Middleware & View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Default Home Route
app.use(allRoutes);

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found Error!!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;