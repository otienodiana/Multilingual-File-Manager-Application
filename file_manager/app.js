const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const sequelize = require('./config/db'); // Make sure this path is correct
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files'); // Ensure this file exists

require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware to parse request bodies
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// i18next initialization
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es'], // languages to preload
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json' // Adjust the path if necessary
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie']
    }
  });

// Session management
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes); // Ensure this route is correct

app.use(i18nextMiddleware.handle(i18next));

// Error handling for unregistered routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
