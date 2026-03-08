# RS Classes 30

## Current State
- Login page: Phone number input → OTP verification → student enters app
- App.tsx stores phone in session, no student name
- Subjects are admin-added; no default subjects exist
- registerStudent backend call only stores phone + classNumber (name is empty)

## Requested Changes (Diff)

### Add
- Student name input field below phone number on LoginPage (step = "phone")
- Name is collected before OTP is sent, stored in component state
- After OTP verification, call registerStudent with name (or update if already exists)
- Name stored in AppState and session storage
- Subject seed: Show "Maths" and "Science" as built-in default subjects in SubjectSelectPage when no admin-added subjects exist (frontend-only fallback with placeholder IDs)

### Modify
- LoginPage: add name field below phone field, validate name is non-empty before sending OTP
- App.tsx: add `studentName` to AppState; pass name through login flow; on login success store name
- SubjectSelectPage: if no subjects from backend, show Maths and Science as demo/default options

### Remove
- Nothing removed

## Implementation Plan
1. Update LoginPage.tsx: add `name` state, render name Input below phone Input, validate name before handleSendOtp, pass name to onLoginSuccess callback
2. Update App.tsx: add `studentName` to AppState and session serialization; update handleLoginSuccess to accept name; pass studentName to downstream pages
3. Update SubjectSelectPage.tsx: add default subjects (Maths, Science) as fallback when subjects array is empty — use placeholder bigint IDs (0n, 1n) that are clearly demo
4. Update useQueries.ts: extend useRegisterStudent to accept name param and pass it to backend registerStudent call (or add separate updateStudentName call after registration)
