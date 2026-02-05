const { Project, Video } = require('../models');

// Get all projects for current user
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.userId },
      include: [{
        model: Video,
        as: 'videos',
        attributes: ['id', 'title', 'status', 'thumbnail'],
      }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ projects });
  } catch (error) {
    next(error);
  }
};

// Create new project
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description,
      userId: req.userId,
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Get single project
const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({
      where: { id, userId: req.userId },
      include: [{
        model: Video,
        as: 'videos',
        order: [['createdAt', 'DESC']],
      }],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// Update project
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findOne({
      where: { id, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.update({ name, description });

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete project
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete all videos in project first
    await Video.destroy({ where: { projectId: id } });
    await project.destroy();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
};
