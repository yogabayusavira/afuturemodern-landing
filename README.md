# A Future Modern — Landing Page

The public landing page for [A Future Modern](https://afuturemodern.com) — a **Venture Labor Cooperative** where creative talent collectively owns the platforms and services they build.

## What Is A Future Modern?

A Future Modern is a **member-owned cooperative network** for creative talent and service clients. It operates on a *Venture Labor* model: workers earn equity and token rewards ($BUILD) instead of just gig pay. The mission is to capture surplus value and return it to the people who create it.

**Core model:**
- **Revenue waterfall** — 85% to direct labor, 12% to active administration, 3% to cooperative treasury
- **$BUILD token** — fixed supply, 95% distributed to members
- **Quarterly work proposals** — members commit Effective Weeks, get guaranteed pay + token rewards
- **Democratic governance** — members vote, moderate, and earn equity. Membership is earned, not sold

**Values:** Provenance, Discernment, Equity.

A Future Modern serves artists, engineers, designers, athletes, and knowledge workers through managed services ($BUILD Services), a talent marketplace, and product ventures (XR experiences, AR hardware). It positions itself as the worker-owned alternative to platforms like Upwork and Fiverr — offering ownership, curation, and shared upside instead of transactional gigs.

> 1,000+ member network. Building publicly. Workers built it — workers own it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Bundler | Vite 5 |
| Animation | GSAP 3 |
| Server | Express 5 (Node.js) |
| Email | Resend |
| File uploads | Multer |
| Dev runner | Concurrently |
| Deployment | Nixpacks / Docker-ready |

---

## Getting Started

### Prerequisites

- Node.js >= 20 (see [`.nvmrc`](.nvmrc))
- npm

### Install

```bash
npm install
```

### Environment variables

Copy the template and fill in your values:

```bash
cp .env.example .env   # or create .env manually — see table below
```

| Variable | Required | Description |
|---|---|---|
| `VITE_APP_NAME` | No | Display name (default: `Future Modern`) |
| `VITE_APP_URL` | No | Public URL used in client code |
| `RESEND_API_KEY` | **Yes** | Resend API key for outbound email |
| `RESEND_FROM_EMAIL` | **Yes** | Sender address (`Name <addr@domain.com>`) |
| `TALENT_APPLICATIONS_EMAIL` | **Yes** | Inbox for talent applications |
| `FIND_TALENT_EMAIL` | **Yes** | Inbox for "find talent" enquiries |
| `BUILD_TEAM_EMAIL` | **Yes** | Inbox for build-team enquiries |

> **Never commit `.env`** — it is already in `.gitignore`.

### Run (dev)

Starts the Vite dev server **and** the Express API server concurrently:

```bash
npm run dev
```

- Frontend → `http://localhost:5173`
- API server → port defined in `server/index.js`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite + Express in watch mode |
| `npm run dev:client` | Vite only |
| `npm run dev:server` | Express only |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm start` | Start Express server (serves built `dist/`) |
| `npm run start:prod` | Same as `start` with `NODE_ENV=production` |

---

## Project Structure

```
afuturemodern-landing/
├── src/
│   ├── App.tsx              # Root component & page composition
│   ├── style.css            # Global styles & design tokens
│   ├── components/
│   │   ├── ProjectModal.tsx # Project showcase modal
│   │   ├── TalentModal.tsx  # Talent application modal
│   │   └── ScrollCue.tsx    # Scroll indicator component
│   └── hooks/               # Custom React hooks
├── server/
│   └── index.js             # Express API (email endpoints)
├── public/                  # Static assets served by Vite
├── uploads/                 # Temp storage for Multer uploads (git-ignored)
├── dist/                    # Production build output (git-ignored)
├── index.html               # Vite HTML entry point
├── vite.config.ts
├── nixpacks.toml            # Nixpacks deployment config
└── .env                     # Local secrets (git-ignored)
```

---

## Deployment

The project ships a [`nixpacks.toml`](nixpacks.toml) and a [`.dockerignore`](.dockerignore), making it compatible with:

- **Railway / Render / Fly.io** (Nixpacks auto-detected)
- Any Docker-based host (`npm run build && npm run start:prod`)

Set all environment variables listed above in your hosting provider's secrets manager before deploying.
