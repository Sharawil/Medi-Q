const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware.protect);

// Queue routes
router.get('/', queueController.getQueueTokens);
router.get('/:id', queueController.getQueueTokenById);
router.put('/:id', queueController.updateQueueTokenStatus);
router.get('/stats/stats', queueController.getQueueStats);

module.exports = router;