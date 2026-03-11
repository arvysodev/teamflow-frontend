# Teamflow

Teamflow is a small full-stack task management application designed as a portfolio project.  
It demonstrates a typical modern web architecture with a Java Spring Boot backend and a React + TypeScript frontend.

The application allows users to manage workspaces, collaborate on projects, and organize tasks using a simple kanban-style workflow.

---

## Features

### Authentication
- User registration
- Email verification (demo: token logged by backend)
- Login with JWT authentication

### Workspaces
- Create workspaces
- Rename / close / restore workspaces
- Invite members via email token
- Accept workspace invitations
- View workspace members
- Promote members to owner
- Remove members
- Leave workspace

### Projects
- Create projects inside a workspace
- Rename projects
- Archive / restore projects
- Search and sort projects

### Tasks
- Create tasks inside projects
- Kanban-style board (Todo / In Progress / Done)
- View task details
- Edit task title and description
- Change task status
- Assign tasks to workspace members
- Unassign tasks

---

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3**
- **Spring Security**
- **JWT authentication**
- **PostgreSQL**
- **Flyway** for database migrations
- **JUnit + Mockito** for testing
- **Gradle**

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **TanStack Query**
- **React Router**
- **shadcn/ui**
- **TailwindCSS**

---

## Architecture

The project follows a typical layered architecture.

Backend:
*Controller → Service → Repository → Database*

Frontend:
*API layer → React Query → UI components*

**Key principles used:**
- clear separation of concerns
- typed API communication
- server-side pagination, filtering and sorting
- optimistic UI updates via query invalidation

---

## Demo Notes

Some features are simplified because this is a portfolio project:

- Email verification tokens are logged in the backend instead of being sent by email.
- Access tokens are stored in `localStorage` for simplicity (production systems typically use httpOnly cookies).
- Workspace member information currently exposes only user IDs.

---

## Running the Project

### Backend

Look how to run backend at https://github.com/arvysodev/teamflow-backend

### Frontend

Requirements:

- Node.js 18+

*Make sure that You run all the commands in the correct directory*

Install dependencies

```
npm install
```

Start development server:

```
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## What this project demonstrates

The project is built to demonstrate:

- full-stack application design
- REST API design
- authentication and authorization
- relational data modeling
- frontend state management with React Query
- modular frontend architecture
- integration between backend and frontend systems