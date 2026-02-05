const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(auth);

// Video routes under project
router.get('/project/:projectId', videoController.getVideos);
router.post('/project/:projectId', upload.single('video'), videoController.uploadVideo);

// Individual video routes
router.get('/:id', videoController.getVideo);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
