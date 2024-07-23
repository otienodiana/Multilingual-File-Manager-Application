const express = require('express');
const i18next = require('i18next');
const middleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
const fileRoutes = require('./routes/files');

const app = express();

i18next.use(Backend).use(middleware.LanguageDetector).init({
    fallbackLng: 'en',
    backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json'
    },
    detection: {
        order: ['querystring', 'cookie'],
        caches: ['cookie']
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the File Manager Application!');
});

app.use(middleware.handle(i18next));
app.use(express.json());
app.use('/api', fileRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
