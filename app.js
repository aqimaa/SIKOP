// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Database Configuration
const database = require('./config/database'); // Pastikan file database sudah diatur dengan benar

// Route Imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const masterRoutes = require('./routes/masterRoutes');
const simpananRoutes = require('./routes/simpananRoutes');
const pinjamanRoutes = require('./routes/pinjamanRoutes');
const kreditRoutes = require('./routes/kreditRoutes');
const laporanRoutes = require('./routes/laporanRoutes');

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

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRoutes);
app.use('/master', masterRoutes);
app.use('/simpanan', simpananRoutes);
app.use('/pinjaman', pinjamanRoutes);
app.use('/kredit', kreditRoutes);
app.use('/laporan', laporanRoutes);

// Default Home Route
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Catch 404 and Forward to Error Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

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