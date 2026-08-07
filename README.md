# Labyrinth Generalist

Distributed algorithmic pricing and lead-scoring system with microservices architecture.

## Architecture

- **Frontend**: Single-file HTML/CSS/JavaScript application
- **Gateway**: TypeScript API gateway with validation
- **ML Service**: Python FastAPI service for lead scoring
- **Transaction Engine**: Java Spring Boot service for pricing logic

## Quick Start

```bash
docker-compose up --build
```

## Services

- Frontend: http://localhost:8080
- Gateway: http://localhost:3000
- ML Service: http://localhost:8000
- Transaction Engine: http://localhost:8081
```

**.gitignore**
```
node_modules/
dist/
__pycache__/
*.pyc
.env
target/
*.class
.DS_Store
*.log
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  frontend:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./frontend/index.html:/usr/share/nginx/html/index.html

  gateway:
    build: ./backend/gateway
    ports:
      - "3000:3000"
    environment:
      - PORT=3000

  ml-service:
    build: ./backend/ml-service
    ports:
      - "8000:8000"
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000

  transaction-engine:
    build: ./backend/transaction-engine
    ports:
      - "8081:8080"
```
