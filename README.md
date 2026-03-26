# CENDAS Assessment — Full Stack Developer

## Overview

An offline-first web app for tracking tasks on construction plans. Users log in by username, and all task data is stored per user with no overlap between accounts.

## Tech Stack

- React 19 + TypeScript (Vite)
- React Router v7
- RxDB + Dexie plugin (IndexedDB)
- shadcn/ui + Tailwind CSS

## Getting Started

```bash
yarn install
yarn dev
```

To build for production:

```bash
yarn build
yarn preview
```

## Video Walkthrough

[Loom video](https://www.loom.com/share/49846f8fd87741e5a489a144976c4d2f)

## Time Spent

Total: ~10 hours

| Task | Time |
|------|------|
| Initial setup and tech stack research (RxDB learning curve) | ~2 hrs |
| Core functionality — task creation, updating, schema design, minor refactoring | ~5 hrs |
| Sidebar with task list, task pin positioning on image resize | ~3 hrs |

## TODO / Improvements

- [ ] Add proper sync functionality — currently using a simple adapter due to unknown API
- [ ] Extract DB interactions from components into a dedicated service/class for better separation of concerns
- [ ] Add plan upload, or fetch the plan (for now is image from assets dir)
- [ ] UI polish — functional as an MVP but needs visual improvements
