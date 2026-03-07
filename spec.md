# RS Classes 30

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Student login via phone number + OTP (simulated OTP for now since SMS is not supported)
- Class selector (Class 1 to 12) as first screen after login
- Subject selector based on chosen class
- Content mode selector: Live Class, Recorded Class, Quiz, PDF Notes, Doubt
- Content viewer for each mode:
  - Live Class: shows a live class link or embed (URL stored by admin)
  - Recorded Class: video player or link to uploaded video
  - Quiz: question list with options and answer reveal
  - PDF Notes: PDF viewer or download link
  - Doubt: student can submit a text doubt with their class/subject context
- Admin section accessible via password login
  - Upload/manage content: recorded videos, PDFs, live class links, quizzes
  - View all submitted doubts (with class, subject, student info, doubt text)
  - Manage subjects per class
- Student profile: stores phone number, selected class preference

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

**Backend (Motoko):**
- Student entity: id, phone, name (optional), createdAt
- Admin entity: single admin with password hash
- Class list: fixed 1-12
- Subject entity: id, classNumber, name
- Content entity: id, classNumber, subjectId, type (LiveClass | RecordedClass | Quiz | PDFNotes), title, url/data, createdAt
- Quiz entity: id, contentId, questions array (question, options[4], correctIndex)
- Doubt entity: id, studentId, classNumber, subjectId, doubtText, createdAt, status (pending/answered), adminReply

**APIs:**
- requestOTP(phone) -> OTP code (returned directly for simulation)
- verifyOTP(phone, otp) -> session token
- getClasses() -> [1..12]
- getSubjects(classNumber) -> [Subject]
- getContent(classNumber, subjectId, type) -> [Content]
- submitDoubt(classNumber, subjectId, doubtText) -> Doubt
- adminLogin(password) -> admin session token
- addSubject(classNumber, name) -> Subject
- addContent(classNumber, subjectId, type, title, url) -> Content
- addQuiz(contentId, questions) -> Quiz
- getDoubts() -> [Doubt] (admin only)
- replyDoubt(doubtId, reply) -> Doubt (admin only)
- deleteContent(contentId) -> bool
