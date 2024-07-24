const express = require('express');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const fileRoutes = require('./routes/files');

const app = express();

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es'], // languages to preload
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json' // path to your language files
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the File Manager Application!');
});

app.use(middleware.handle(i18next));
app.use('/files', fileRoutes);

app.use('/api', fileRoutes);
const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log('Server running on port 3000'));
