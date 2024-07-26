const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json'
    },
    fallbackLng: 'en',
    preload: ['en', 'fr'], // Add your supported languages here
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie']
    },
    whitelist: ['en', 'fr'], // List of allowed languages
    debug: true // Enable debug for detailed logs
  });

module.exports = i18next;
