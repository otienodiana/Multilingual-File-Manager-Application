
const express = require('express');
<<<<<<< HEAD
=======
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
>>>>>>> 5678f525ce63be6653ab372c815714779124f8e7
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

// Initialize Express app
const app = express();

<<<<<<< HEAD
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
=======
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
>>>>>>> 5678f525ce63be6653ab372c815714779124f8e7

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


<<<<<<< HEAD
// Sync database and start server
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
=======
app.use(middleware.handle(i18next));
app.use('/files', fileRoutes);

app.use('/api', fileRoutes);
const PORT = process.env.PORT || 3000;
// Error handling for unregistered routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

app.listen(3000, () => console.log('Server running on port 3000'));
>>>>>>> 5678f525ce63be6653ab372c815714779124f8e7
