const express = require('express');
const multer = require('multer');
const db = require('../config/db');
const fileQueue = require('../config/queue');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const userId = req.user.id;

    fileQueue.add({ userId, file }, { attempts: 3 });

    res.send('File upload queued');
});

fileQueue.process(async (job, done) => {
    const { userId, file } = job.data;

    db.query('INSERT INTO files (user_id, name, size, type, path) VALUES (?, ?, ?, ?, ?)',
        [userId, file.originalname, file.size, file.mimetype, file.path],
        (err, results) => {
            if (err) done(err);
            done();
        });
});

router.get('/list', (req, res) => {
    const userId = req.user.id;

    db.query('SELECT * FROM files WHERE user_id = ?', [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

router.post('/rename', (req, res) => {
    const { fileId, newName } = req.body;

    db.query('UPDATE files SET name = ? WHERE id = ?', [newName, fileId], (err, results) => {
        if (err) throw err;
        res.send('File renamed');
    });
});

router.post('/delete', (req, res) => {
    const { fileId } = req.body;

    db.query('DELETE FROM files WHERE id = ?', [fileId], (err, results) => {
        if (err) throw err;
        res.send('File deleted');
    });
});

router.get('/upload-status/:jobId', async (req, res) => {
    const job = await fileQueue.getJob(req.params.jobId);

    if (!job) {
        return res.status(404).send('Job not found');
    }

    res.json({ progress: job.progress() });
});

module.exports = router;