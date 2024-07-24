const express = require('express');
const File = require('../models/file');
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

router.post('/files', async (req, res) => {
  try {
    const { name, size, path } = req.body; // Use 'path' here instead of 'directory'
    if (!req.user) return res.status(401).send(req.t('unauthorized'));
    const file = await File.create({ userId: req.user.id, name, size, path });
    res.json({ message: req.t('file_uploaded'), file });
  } catch (error) {
    res.status(500).json({ message: req.t('error'), error: error.message });
  }
});

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

router.get('/files', async (req, res) => {
  try {
    const files = await File.findAll({ where: { userId: req.user.id } });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: req.t('error'), error: error.message });
  }
});

router.get('/list', (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM files WHERE user_id = ?', [userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.put('/files/:id', async (req, res) => {
  try {
    const { name, size, path } = req.body; // Use 'path' here instead of 'directory'
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).send(req.t('file_not_found'));
    if (file.userId !== req.user.id) return res.status(403).send(req.t('forbidden'));
    await file.update({ name, size, path });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: req.t('error'), error: error.message });
  }
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

router.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).send(req.t('file_not_found'));
    if (file.userId !== req.user.id) return res.status(403).send(req.t('forbidden'));
    await file.destroy();
    res.send(req.t('file_deleted'));
  } catch (error) {
    res.status(500).json({ message: req.t('error'), error: error.message });
  }
});

router.get('/upload-status/:jobId', async (req, res) => {
  const job = await fileQueue.getJob(req.params.jobId);

  if (!job) {
    return res.status(404).send('Job not found');
  }

  res.json({ progress: job.progress() });
});

module.exports = router;