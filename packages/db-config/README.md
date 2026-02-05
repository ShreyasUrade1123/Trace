# DB Config

Shared Sequelize configuration for SkyDocs.

## Usage

This package is intended for sharing database configuration between services.
Currently, the Node.js server has its own embedded config in `/server/src/config/database.js`.

## Migrations

Run migrations from the server directory:
```bash
cd server
npm run db:sync
```

## Connection String Examples

### SQLite (Development)
```
DB_DIALECT=sqlite
DB_STORAGE=./data/skydocs.db
```

### PostgreSQL (Production)
```
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skydocs
DB_USER=postgres
DB_PASSWORD=your_password
```
