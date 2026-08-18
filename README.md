# MERN Stack Project

A full-stack application built with MongoDB, Express, React, and Node.js.

## Tech Stack

- **Frontend:** React 18
- **Backend:** Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Testing:** Jest, Supertest, React Testing Library
- **Containerization:** Docker, Docker Compose

## Project Structure

```
├── backend/
│   ├── server.js          # Express API server
│   ├── .env               # Environment variables
│   ├── package.json
│   └── test/
│       └── items.test.js  # API integration tests
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.test.js    # Component tests
│   │   └── index.js       # Entry point
│   ├── public/
│   │   └── index.html
│   └── package.json
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Container orchestration
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose (for containerized setup)
- MongoDB Atlas account or local MongoDB instance

### Local Development

```bash
# Backend
cd backend
npm install
npm start          # Runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm start          # Runs on http://localhost:3000
```

### Running Tests

```bash
# Backend tests (8 tests)
cd backend
npm test

# Frontend tests (6 tests)
cd frontend
npm test
```

### Docker

```bash
# Build and run all services
docker-compose up --build

# Stop all services
docker-compose down
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/items | List all items |
| POST | /api/items | Create a new item |
| GET | /api/items/:id | Get a single item |
| DELETE | /api/items/:id | Delete an item |

### Create Item

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "My Item", "description": "Item description"}'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/mern_db |
| PORT | Backend server port | 5000 |

## License

MIT
