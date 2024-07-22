const i18next = require('i18next');
const middleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');

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

module.exports = i18next;
