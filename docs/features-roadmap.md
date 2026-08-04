# Features Roadmap

## Email Reminder — Day-of Event Notifications

### Current State
- User model already has `email` (used for login)
- No scheduler/cron infrastructure
- No email service configured

### Changes Required

**1. Schema — add opt-in field**
- Add `remindersEnabled Boolean @default(false)` to `User` model
- Run `prisma migrate`

**2. Install dependencies**
- `node-cron` — daily scheduler
- `@sendgrid/mail` — email delivery (free tier: 100/day)

**3. New file: `server/services/reminder.js`**
- Cron job runs daily at 8 AM
- Queries users where `remindersEnabled = true`
- For each user, fetches events where `date = today`
- Sends email via SendGrid with the day's event list
- Logs sent/error for observability

**4. New env vars (in `.env`)**
- `SENDGRID_API_KEY` — from SendGrid dashboard
- `SENDGRID_FROM_EMAIL` — verified sender email
- `REMINDER_CRON` — optional, defaults to `"0 8 * * *"` (8 AM daily)

**5. New route: `server/routes/settings.js`**
- `PUT /api/settings` — toggle `remindersEnabled` on/off
- Protected by existing `authenticate` middleware

**6. Frontend: settings toggle**
- Add a simple toggle switch in Header (or a dropdown menu)
- Calls `PUT /api/settings` to save preference

**7. Start cron on boot**
- Import and start `reminder.js` in `server/index.js` after `app.listen()`

### File changes summary
| File | Change |
|---|---|
| `server/prisma/schema.prisma` | Add `remindersEnabled` to User |
| `server/package.json` | Add `node-cron`, `@sendgrid/mail` |
| `server/services/reminder.js` | **New** — cron job + email logic |
| `server/routes/settings.js` | **New** — settings API |
| `server/index.js` | Start cron job |
| `server/.env.example` | Add SendGrid env vars |
| `client/src/components/Header.jsx` | Add reminder toggle |
