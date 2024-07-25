const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
require('dotenv').config();

// Initialize Express app
const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

// Initialize Passport
require('./config/passport')(passport); // Ensure this line is present
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/auth', authRoutes);  // Authentication routes
app.use('/files', fileRoutes); // File management routes

// View routes
app.get('/', (req, res) => {
  console.log('Home route accessed');
  res.render('index');
});
app.get('/register', (req, res) => {
  console.log('Register route accessed');
  res.render('register');
});
app.get('/login', (req, res) => {
  console.log('Login route accessed');
  res.render('login');
});
app.get('/manage-files', (req, res) => {
  console.log('Manage Files route accessed');
  res.render('manage-files');
});

// Error handling for unregistered routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
