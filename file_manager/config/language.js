const i18next = require('i18next');

function setLanguage(req, res, next) {
    const language = req.query.language || req.cookies || 'en';
    req.i18n = i18next; // Ensure i18next is attached to req
    i18next.changeLanguage(language, (err) => {
        if (err) {
            console.error('Error changing language:', err);
            return next(err);
        }
        next();
    });
}

module.exports = { setLanguage };
