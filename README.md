# Portfolio Backend

Node.js + Express + MongoDB API powering your portfolio site and its admin dashboard.
You log in once with credentials stored in `.env`, and from the dashboard (built in the
next step) you'll be able to edit skill percentages, add/remove skills, add/edit/delete
projects, and update your profile/about info — all without touching code.

## 1. Prerequisites

- Node.js 18+ installed (`node -v` to check)
- A free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
  (Create a free M0 cluster → Database Access: create a user → Network Access: allow
  your IP (or 0.0.0.0/0 for simplicity while developing) → get your connection string)

## 2. Setup

```bash
cd portfolio-backend
npm install
cp .env.example .env
```

Now open `.env` and fill in:

| Variable | What to put |
|---|---|
| `MONGODB_URI` | Your Atlas connection string (from step 1) |
| `ADMIN_EMAIL` | The email you'll log into the dashboard with |
| `ADMIN_PASSWORD` | Whatever password you want — **this is the login password**, change it any time by editing this file and restarting the server |
| `JWT_SECRET` | A random string. Generate one with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `CLIENT_URL` | Where your React frontend will run (default `http://localhost:5173` for Vite) |

## 3. Load your resume data into the database

```bash
npm run seed
```

This fills the database with the skills/projects/education from your resume, using
placeholders for things the resume didn't have (LinkedIn URL, portfolio URL, graduation
year, phone). You can either edit these directly in `seed.js` before seeding, or fix them
later from the admin dashboard.

To wipe the data later: `npm run seed:destroy`

## 4. Run the server

```bash
npm run dev      # auto-restarts on file changes (uses nodemon)
# or
npm start        # plain node
```

You should see:
```
MongoDB Connected: ...
Server running in development mode on port 5000
```

Test it's alive: open `http://localhost:5000/api/health` in a browser — you should see
`{"success":true,"message":"API is running"}`.

## 5. API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Route | Access | Body |
|---|---|---|---|
| POST | `/auth/login` | Public | `{ "email", "password" }` |
| POST | `/auth/logout` | Public | — |
| GET | `/auth/me` | Private | — (checks if you're logged in) |

Login sets an `httpOnly` cookie automatically. It also returns a `token` field in the
JSON response for convenience if you're testing with curl/Postman.

### Skills
| Method | Route | Access |
|---|---|---|
| GET | `/skills` | Public |
| POST | `/skills` | Private |
| PUT | `/skills/:id` | Private (e.g. change `percentage`) |
| DELETE | `/skills/:id` | Private |

Skill fields: `name`, `category` (`Languages`/`Frontend`/`Backend`/`Database`/`Tools`/`Soft Skills`/`Other`), `percentage` (0–100), `icon`, `order`.

### Projects
| Method | Route | Access |
|---|---|---|
| GET | `/projects` | Public |
| POST | `/projects` | Private |
| PUT | `/projects/:id` | Private |
| DELETE | `/projects/:id` | Private |

Project fields: `title`, `description`, `techStack` (array), `image`, `githubUrl`, `liveUrl`, `featured` (bool), `order`.

### Profile
| Method | Route | Access |
|---|---|---|
| GET | `/profile` | Public |
| PUT | `/profile` | Private |

Profile fields: `name`, `title`, `summary`, `email`, `phone`, `location`, `githubUrl`,
`linkedinUrl`, `portfolioUrl`, `resumeUrl`, `education` (array), `softSkills` (array),
`achievements` (array), `languages` (array).

## 6. Quick test with curl

```bash
# Log in and save the cookie
curl -c cookies.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"youremail@example.com","password":"YourPassword"}'

# Use the cookie to update a skill's percentage
curl -b cookies.txt -X PUT http://localhost:5000/api/skills/<skill_id> \
  -H "Content-Type: application/json" \
  -d '{"percentage": 90}'
```

## Security notes

- `.env` is git-ignored — never commit it.
- Login is rate-limited to 5 attempts per 15 minutes per IP.
- The JWT is stored as an `httpOnly` cookie so frontend JavaScript can't read it
  (protects against XSS token theft).
- `helmet` sets sane security headers by default.
- Before deploying: set `NODE_ENV=production`, use a long random `JWT_SECRET`, and
  restrict MongoDB Atlas network access to your server's IP instead of `0.0.0.0/0`.

## What's next

This backend is step 1. Next up: the React frontend — dark, futuristic theme, animated
custom cursor, public portfolio pages that read from these APIs, and an admin dashboard
(protected by this login) to edit everything visually.
