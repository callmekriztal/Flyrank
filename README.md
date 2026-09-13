# Task API — Dockerized Express & PostgreSQL Stack

A containerized Node.js (Express) REST API for managing tasks, backed by a PostgreSQL database running via Docker Compose.

---

## Quick Start (Stranger Clone Test)

To run the entire application stack from a fresh clone with a single command:

```bash
# 1. Clone the repository and copy environment variables
cp .env.example .env

# 2. Start the API and PostgreSQL containers
docker compose up --build
```

The API will be available at `http://localhost:3000`. On first launch, the database table `tasks` is automatically created and seeded with 3 example tasks.

To stop the containers:
```bash
docker compose down
```

---

## Environment Variables

Configured in `.env` (derived from `.env.example`):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:dev@db:5432/tasks` (for Docker Compose) or `postgres://postgres:dev@localhost:5432/tasks` (local) |

---

## API Endpoints

| Method | Endpoint | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | List all tasks | `200 OK` |
| `GET` | `/tasks/:id` | Get task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | Create a new task (`{ "title": "Task title" }`) | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update task (`{ "title": "Updated", "done": true }`) | `200 OK` / `404 Not Found` / `400 Bad Request` |
| `DELETE` | `/tasks/:id` | Delete task by ID | `204 No Content` / `404 Not Found` |

---

## Sample Request & Response Output

```bash
$ curl -i http://localhost:3000/tasks
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 146
ETag: W/"92-0LCgKRzdaFP2TxtBfj+qJOBXABw"
Date: Sun, 13 Sep 2026 15:16:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[
  {"id":1,"title":"Learn Express","done":false},
  {"id":2,"title":"Build CRUD API","done":false},
  {"id":3,"title":"Practice PostgreSQL","done":false}
]
```

---

## Database Verification & Screenshot Instructions

To inspect the seeded database directly using `psql` in the running database container:

```bash
# Connect to the PostgreSQL database container
docker exec -it taskdb psql -U postgres -d tasks

# Verify relations
\dt

# Query seeded data
SELECT * FROM tasks;
```

> **Submission Note:** Include a screenshot of your terminal (or GUI tool like pgAdmin, DBeaver, or TablePlus) executing `\dt` and `SELECT * FROM tasks;` showing the seeded rows to verify database initialization.# Flyrank_Assignments
# Flyrank_Assignments
