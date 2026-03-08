# RS Classes 30

## Current State
- Login page has RS Classes 30 branding in a medium-sized heading (text-3xl)
- AppHeader is a simple sticky navbar with logo, title, and logout button only
- No AI chat feature exists
- No progress tracking page exists
- No navbar links to Admin or extra features

## Requested Changes (Diff)

### Add
- Navbar (AppHeader) 3 navigation links/buttons:
  1. "Talk to Siwachan Sir" -- opens an AI-style chat page (simulated Q&A, no real LLM)
  2. "Admin" -- navigates to /admin
  3. "Progress" -- opens a student progress page showing content viewed/doubts submitted
- TalkToSiwachanPage: a chat UI where students can ask study questions; since no real LLM is available, show a friendly simulated response from "Siwachan Sir"
- ProgressPage: shows student's selected class, subjects studied, modes accessed, and doubts submitted

### Modify
- LoginPage: Make "RS Classes 30" heading much bigger and more prominent (hero-size, e.g. text-5xl or larger) with "by Siwachan Sir" subtitle also larger
- AppHeader: Add 3 nav buttons/icons in the right side of the navbar (alongside or replacing the lone logout button)
- App.tsx: Add new views for "talkToSir" and "progress", wire navbar callbacks

### Remove
- Nothing removed

## Implementation Plan
1. Update LoginPage.tsx -- increase h1 font size to text-5xl/text-6xl, make subtitle larger, keep existing 3-step login flow intact
2. Update AppHeader.tsx -- add 3 nav items: "Talk to Sir" (bot icon), "Progress" (bar chart icon), "Admin" (shield icon); keep logout button; pass callbacks onTalkToSir, onProgress, onAdmin
3. Create TalkToSiwachanPage.tsx -- chat interface with pre-programmed helpful responses simulating a teacher AI
4. Create ProgressPage.tsx -- shows student name, class, subjects accessed, modes used, doubts count
5. Update App.tsx -- add "talkToSir" and "progress" to AppView type; pass new handlers to AppHeader; render new pages
6. Pass new nav handlers through all page components that render AppHeader
