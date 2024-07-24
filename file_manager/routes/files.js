const express = require('express');
const File = require('../models/file');
const router = express.Router();

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

router.get('/files', async (req, res) => {
  try {
    const files = await File.findAll({ where: { userId: req.user.id } });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: req.t('error'), error: error.message });
  }
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

module.exports = router;
