# RS Classes 30

## Current State
Admin section has basic tabs for Subjects, Content, Quiz, and Doubts management. It works but feels like a simple tabbed form rather than a proper CMS. There is no dashboard overview, no student management view, and no way to see statistics at a glance.

## Requested Changes (Diff)

### Add
- Admin Dashboard tab: stats cards showing total subjects, total content items, pending doubts, total students registered
- Students tab: list of registered students with their phone, name, class details
- Content edit functionality: ability to update title/description/link of existing content items
- "All Classes" overview in subjects tab: show subjects grouped by class number for a bird's-eye view
- Sidebar-style navigation (desktop) or bottom tabs (mobile) for the admin panel for a proper CMS feel
- Announcements/Notice Board tab: admin can post notices/announcements that students can see

### Modify
- Admin dashboard layout: replace single-column tab panel with a richer CMS layout (sidebar on desktop, bottom nav on mobile)
- Subjects tab: add "view by all classes" toggle alongside existing per-class view
- Content tab: add edit button on each content card that opens an inline edit form
- Doubts tab: show total count badges in tab header; keep existing reply functionality

### Remove
- Nothing removed; all existing functionality preserved

## Implementation Plan
1. Add `getAllStudents` and `getStats` backend queries (add to Motoko: getAllStudents, getAnnouncementList, addAnnouncement, deleteAnnouncement)
2. Update backend.d.ts to include new query types
3. Update AdminPage.tsx:
   - Replace flat Tabs with a sidebar (desktop) / bottom-nav (mobile) CMS layout
   - Add Dashboard tab with stat cards
   - Add Students tab showing all registered students
   - Add Announcements tab for posting notices
   - Add edit inline form to Content tab
   - Add "view all classes" toggle to Subjects tab
   - Add count badges to Doubts navigation item
