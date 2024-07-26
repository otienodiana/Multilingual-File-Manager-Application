const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const flash = require('connect-flash');
const File = require('./models/fileModel'); // Adjust the path according to your file structure
require('dotenv').config();
const multer = require('multer');
const ensureAuthenticated = require('./middleware/authMiddleware'); // Updated path
const fileModel = require('./models/fileModel');
const i18next = require('./i18n');
const i18nextMiddleware = require('i18next-http-middleware');

// Initialize Express app
const app = express();

// Initialize i18next middleware
app.use(i18nextMiddleware.handle(i18next));

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
app.set('view engine', 'ejs');

// Define routes
app.use('/auth', authRoutes);  // Authentication routes
app.use('/files', fileRoutes); // File management routes

// View routes
app.get('/', (req, res) => {
  console.log('Home route accessed');
  res.render('home', { req });
});

app.get('/register', (req, res) => {
  console.log('Register route accessed');
  res.render('register', { req });
});

app.get('/login', (req, res) => {
  console.log('Login route accessed');
  res.render('login', { req });
});

// Example route
app.get('/index', (req, res) => {
  res.render('index', { 
    title: req.t('welcome'), 
    loginText: req.t('login'),
    logoutText: req.t('logout'),
    req // Pass req object here
  });
});

app.get('/change-language/:lng', (req, res) => {
  req.session.lng = req.params.lng;
  res.redirect('back');
});

app.get('/manage-files', ensureAuthenticated, (req, res) => {
  const userId = req.user.id; // Assuming you have a user object in the request

  fileModel.listFilesForUser(userId, (err, files) => {
    if (err) {
      console.error('Error fetching files:', err);
      return res.status(500).json({ error: err.message });
    }
    res.render('manage-files', { files, req });
  });
});

// Error handling for unregistered routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

app.use(flash());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
