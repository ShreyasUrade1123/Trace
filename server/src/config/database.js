const { Sequelize } = require('sequelize');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

let sequelize;

if (process.env.DB_DIALECT === 'postgres') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: isDev ? console.log : false,
    }
  );
} else {
  // SQLite for development
  const dbPath = path.resolve(__dirname, '../../data/skydocs.db');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: isDev ? console.log : false,
  });
}

module.exports = sequelize;
