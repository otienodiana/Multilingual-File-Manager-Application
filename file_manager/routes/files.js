const express = require('express');
const { File } = require('../models/file');

const router = express.Router();

router.post('/files', async (req, res) => {
  const { name, size, type, directory } = req.body;
  const file = await File.create({ userId: req.user.id, name, size, type, directory });
  res.json({ message: req.t('file_uploaded'), file });
});

router.get('/files', async (req, res) => {
  const files = await File.findAll({ where: { userId: req.user.id } });
  res.json(files);
});

router.put('/files/:id', async (req, res) => {
  const { name, size, type, directory } = req.body;
  const file = await File.findByPk(req.params.id);
  if (file.userId !== req.user.id) return res.status(403).send(req.t('forbidden'));
  await file.update({ name, size, type, directory });
  res.json(file);
});

router.delete('/files/:id', async (req, res) => {
  const file = await File.findByPk(req.params.id);
  if (file.userId !== req.user.id) return res.status(403).send(req.t('forbidden'));
  await file.destroy();
  res.send(req.t('file_deleted'));
});

module.exports = router;
