const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../config/upload');

router.get('/public/search', bookController.searchPublic); // Public search
router.get('/report', bookController.search);
router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.post('/', upload.single('cover'), bookController.create);
router.put('/:id', upload.single('cover'), bookController.update);
router.delete('/:id', bookController.delete);

module.exports = router;
