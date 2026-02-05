# SkyDocs API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

---

## Project Endpoints

### List Projects
```http
GET /projects
Authorization: Bearer <token>
```

### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Optional description"
}
```

### Get Project
```http
GET /projects/:id
Authorization: Bearer <token>
```

### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

---

## Video Endpoints

### List Videos in Project
```http
GET /videos/project/:projectId
Authorization: Bearer <token>
```

### Upload Video
```http
POST /videos/project/:projectId
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
title: "Video Title"
```

### Get Video
```http
GET /videos/:id
Authorization: Bearer <token>
```

### Update Video
```http
PUT /videos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Title",
  "transcript": { ... }
}
```

### Delete Video
```http
DELETE /videos/:id
Authorization: Bearer <token>
```

---

## Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-22T12:00:00.000Z",
  "uptime": 3600
}
```

---

## Error Responses

All errors return:
```json
{
  "error": "Error message"
}
```

| Status | Description |
|--------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Not owner of resource |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error |
