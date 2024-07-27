const express = require('express');
const router = express.Router();

// Route to test translations
router.get('/test', (req, res) => {
    // Log the translation for debugging
    console.log('Translation for upload_file:', req.t('upload_file'));
    const translatedText = req.t('upload_file');
    res.send(`The translation for 'upload_file' is: ${translatedText}`);
});

module.exports = router;
