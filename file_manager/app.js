const express = require('express');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth'); // Adjust the path if necessary
const fileRoutes = require('./routes/files');


require('dotenv').config();

// Passport configuration
require('./config/passport')(passport);

const app = express();

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init
// i18next initialization
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es'], // languages to preload
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json', // path to your language files
      loadPath: './locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie']
    }
  });

// Middleware setup
app.use(session({
  secret: 'ce6cc4a694ccd09f0701ed87338a9bbde9f343d508d477b4fe2d10c02ae872d39f51ea141c18410f0091742cffe989efd434309e737170a3cab128f68ef6469d', // Replace with a strong secret
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(middleware.handle(i18next)); // i18next middleware should be used before routes
app.use(express.json());

// Define routes
app.use('/files', fileRoutes);
app.use('/auth', authRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to the File Manager Application!');
});

app.use(middleware.handle(i18next));
app.use('/files', fileRoutes);

app.use('/api', fileRoutes);
const PORT = process.env.PORT || 3000;
// Error handling for unregistered routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

app.listen(3000, () => console.log('Server running on port 3000'));
