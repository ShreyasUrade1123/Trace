const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('uploading', 'processing', 'ready', 'error'),
    defaultValue: 'uploading',
  },
  transcript: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Video;
