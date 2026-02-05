const { Video, Project } = require('../models');
const path = require('path');
const fs = require('fs');

// Get all videos in a project
const getVideos = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const videos = await Video.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']],
    });

    res.json({ videos });
  } catch (error) {
    next(error);
  }
};

// Upload new video
const uploadVideo = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;

    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const video = await Video.create({
      title: title || req.file.originalname,
      filename: req.file.filename,
      url: `/uploads/${projectId}/${req.file.filename}`,
      status: 'uploading',
      projectId,
    });

    // Update status to ready (in real app, this would happen after processing)
    await video.update({ status: 'ready' });

    res.status(201).json({
      message: 'Video uploaded successfully',
      video,
    });
  } catch (error) {
    next(error);
  }
};

// Get single video
const getVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id, {
      include: [{
        model: Project,
        as: 'project',
        attributes: ['id', 'name', 'userId'],
      }],
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Verify ownership
    if (video.project.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ video });
  } catch (error) {
    next(error);
  }
};

// Update video
const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, transcript } = req.body;

    const video = await Video.findByPk(id, {
      include: [{
        model: Project,
        as: 'project',
        attributes: ['userId'],
      }],
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.project.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await video.update({ title, transcript });

    res.json({
      message: 'Video updated successfully',
      video,
    });
  } catch (error) {
    next(error);
  }
};

// Delete video
const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id, {
      include: [{
        model: Project,
        as: 'project',
        attributes: ['userId'],
      }],
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.project.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from disk
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', video.projectId, video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await video.destroy();

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVideos,
  uploadVideo,
  getVideo,
  updateVideo,
  deleteVideo,
};
