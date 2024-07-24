const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize i18next (if applicable)
// ...

// Session management
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

// Initialize Passport
require('./config/passport')(passport); // Make sure this line is present
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/auth', authRoutes);

// Error handling for unregistered routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
