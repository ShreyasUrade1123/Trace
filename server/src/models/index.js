const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Video = require('./Video');

// Define relationships
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Video, { foreignKey: 'projectId', as: 'videos' });
Video.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

module.exports = {
  sequelize,
  User,
  Project,
  Video,
};
