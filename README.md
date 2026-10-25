# Campus Career & Placement Portal

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.3-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/NextAuth-Auth-3C873A?style=for-the-badge" alt="NextAuth" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

A full-stack web application built with Next.js for managing campus career services, training opportunities, placements, and student engagement workflows.

## Why this project?

This project acts as a centralized portal for:
- students to explore jobs and trainings
- officers/admins to manage opportunities and updates
- placement operations and record tracking
- role-based access for different user types

It is designed as a practical software engineering project with real-world portal functionality, data models, and authentication flows.

## Key Features

- Student portal and dashboard
- Job posting and job-related data management
- Training sessions and learning opportunities
- Placement tracking and career updates
- Notification and announcement support
- Student credentials and profile data handling
- Admin / officer access flows
- Secure authentication using NextAuth + JWT-based patterns
- MongoDB-based persistence with Mongoose models
- Modern UI built using Next.js and Tailwind CSS

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API routes, Mongoose
- Database: MongoDB
- Authentication: NextAuth, JWT, bcrypt
- Data handling: Axios, environment-based configuration
- UX: Toast notifications, responsive UI components

## Project Structure

```bash
software-engineering-project/
├── app/
│   ├── admin/
│   ├── api/
│   ├── foot/
│   ├── nav/
│   ├── officer/
│   ├── portal/
│   ├── policy/
│   ├── statistics/
│   ├── student/
│   ├── team/
│   ├── unauthorized/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── database/
│   └── connectDB.js
├── models/
│   ├── JobPosting.js
│   ├── Training.js
│   ├── cards.js
│   ├── credentials.js
│   ├── gallery.js
│   ├── job.js
│   ├── notification.js
│   ├── placement.js
│   ├── student.js
│   └── ...
├── .env.local
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
└── public/
```

## Main Models

The application includes models for:
- students
- jobs and job postings
- training programs
- placement records
- notifications
- credentials
- gallery / cards / media content

This indicates a broader campus management ecosystem rather than a simple single-page app.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file and add the required MongoDB and authentication variables based on your project configuration.

### 3. Run the app

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

This project demonstrates a practical software engineering workflow involving:
- database modeling
- authentication and session handling
- role-based app structure
- full-stack integration
- real-world portal design for academic/career operations

## Deployment

This repository is prepared as a project-ready codebase and can be extended for deployment on Vercel or any Node-compatible hosting platform.

## License

This project is for educational and portfolio use.

---

<p align="center">
  <i>Built as a full-stack software engineering project for campus career and placement management.</i>
</p>
