# Proposal Responses Setup Guide

This guide will help you set up the Google Apps Script backend that logs responses when someone accepts or declines an entourage or principal sponsor proposal on your wedding site.

## Features

- **Response logging**: Store each Confirmed / Declined proposal in a Google Sheet
- **Role tracking**: Record the proposal role id (e.g. `best-man`, `honor-attendant`)
- **Category mapping**: Store the entourage `RoleCategory` for dashboard filtering
- **Delete support**: Remove a logged response by id from the dashboard
- **Statistics**: Optional counts by role and category

## How it fits your app

When a guest responds on the proposal page:

1. Your Next.js API (`/app/api/proposal-responses`) POSTs the response to this script
2. If the guest **Confirmed**, the API also syncs them to your **Entourage** or **Principal Sponsors** sheet (separate scripts — see `ENTOURAGE_SPONSORS_SETUP.md`)
3. This script keeps a separate audit log in the **ProposalResponses** sheet

## Prerequisites

- Google Account
- Google Sheets spreadsheet for your wedding data
- Entourage / Sponsors scripts already deployed (optional but recommended for confirmed responses)

---

## Step 1: Create/Open Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Open your existing wedding spreadsheet (same one used for Entourage / Sponsors)
3. Note the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

---

## Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Create a **new project** if you already use this spreadsheet for other scripts (Entourage, Guests, etc.)
   - Go to [script.google.com](https://script.google.com) > **New project**
   - Or use the same project if you prefer one script file per deployment

---

## Step 3: Add the Script

1. Delete any existing code in the editor
2. Copy the entire contents of `proposal-responses-management.js`
3. Paste it into the Apps Script editor

> **Do not combine with `principal-sponsor-management.js` in the same project.**
> That file already includes proposal-response handling. If both files are present,
> Apps Script fails with `Identifier 'PROPOSAL_SHEET_NAME' has already been declared`.
> Use **one** entry-point file per Apps Script project (see [Related Scripts](#related-scripts)).

---

## Step 4: Initialize the Sheet

1. Click **Save** (💾) or press `Ctrl+S`
2. Name your project (e.g. "Proposal Responses API")
3. Run `initializeProposalResponsesSheet()`:
   - Select `initializeProposalResponsesSheet` from the function dropdown
   - Click **Run** (▶️)
   - Authorize the script on first run
     - Click "Review permissions"
     - Choose your Google account
     - Click "Advanced" if you see a warning
     - Click "Go to [Project Name] (unsafe)"
     - Click "Allow"

4. Return to your spreadsheet — you should see a **ProposalResponses** tab with headers

---

## Step 5: (Optional) Add Sample Data

1. Select `addSampleProposalResponses` from the function dropdown
2. Click **Run** (▶️)
3. Check the **ProposalResponses** sheet for 3 sample rows

---

## Step 6: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: Proposal Responses API
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
     - For tighter access, use "Anyone with Google account"
5. Click **Deploy**
6. Copy the **Web app URL**
   - Example: `https://script.google.com/macros/s/AKfyc.../exec`

> After code changes, use **Deploy** > **Manage deployments** > **Edit** > **New version** > **Deploy** so the live URL picks up updates.

---

## Step 7: Update Your Next.js App

Open `content/site.ts` and set `googleAPI.proposalResponses` to your deployment URL:

```typescript
googleAPI: {
  // ...
  proposalResponses: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
}
```

The API route at `/app/api/proposal-responses/route.ts` reads this value automatically.

---

## Google Sheet Structure

| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | ID | String | Unique id (sent from Next.js or auto-generated) |
| B | Role | String | Proposal role id from `content/proposal-roles.ts` |
| C | Name | String | Guest name, or "Declined Entourage Offer" for declines |
| D | Status | String | `Confirmed` or `Declined` |
| E | SubmittedAt | ISO Date | When the guest responded |
| F | Category | String | Entourage RoleCategory (e.g. Best Man, Groomsmen) |

---

## API Endpoints

These match what `/app/api/proposal-responses/route.ts` expects.

### GET — Fetch all proposal responses

```
GET YOUR_WEB_APP_URL?action=proposals
```

**Response:**

```json
[
  {
    "id": "best-man-1718034567890",
    "role": "best-man",
    "name": "John Smith",
    "status": "Confirmed",
    "submittedAt": "2026-06-10T12:00:00.000Z",
    "category": "Best Man"
  }
]
```

### POST — Log a proposal response

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'proposal',
    id: 'best-man-1718034567890',
    role: 'best-man',
    name: 'John Smith',
    status: 'Confirmed',
    submittedAt: new Date().toISOString(),
    category: 'Best Man',
  }),
})
```

**Response:**

```json
{
  "status": "ok",
  "message": "Proposal response saved successfully",
  "proposal": {
    "id": "best-man-1718034567890",
    "role": "best-man",
    "name": "John Smith",
    "status": "Confirmed",
    "submittedAt": "2026-06-10T12:00:00.000Z",
    "category": "Best Man"
  }
}
```

### POST — Delete a proposal response

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'delete-proposal',
    id: 'best-man-1718034567890',
  }),
})
```

### GET — Statistics (optional)

```
GET YOUR_WEB_APP_URL?action=stats
```

**Response:**

```json
{
  "total": 12,
  "confirmed": 9,
  "declined": 3,
  "byRole": {
    "best-man": 1,
    "groomsman": 4
  },
  "byCategory": {
    "Best Man": 1,
    "Groomsmen": 4
  }
}
```

---

## Testing the Setup

### 1. Test in Apps Script Editor

Run `testSetup()`:

```
Sheet found: ProposalResponses
Last row: 1
Headers: [[ID, Role, Name, Status, SubmittedAt, Category]]
Setup looks good!
```

### 2. Test doGet

Run `testDoGet()` and check **View** > **Logs**.

### 3. Test in Browser

Open:

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=proposals
```

You should see `[]` or your logged responses as JSON.

### 4. Test from your site

1. Start your Next.js dev server
2. Submit a test proposal on the proposal page
3. Confirm a new row appears in **ProposalResponses**
4. If status is **Confirmed**, verify the person also appears in **Entourage** or **PrincipalSponsors**

---

## Related Scripts

| Script | Sheet | Purpose |
|--------|-------|---------|
| `proposal-responses-management.js` | ProposalResponses | Audit log only (standalone web app) |
| `principal-sponsor-management.js` | PrincipalSponsors + ProposalResponses | Sponsors **and** proposal log (combined web app) |
| `entourage-management.js` | Entourage | Live entourage list |

**Pick one proposal entry point** — never paste both `proposal-responses-management.js` and
`principal-sponsor-management.js` into the same Apps Script project. Each can live in its
own project with its own deployment URL, or use the combined sponsor script alone and point
both API routes at that single URL.

Setup guides:

- `ENTOURAGE_SPONSORS_SETUP.md` — entourage & sponsors backends
- `GUEST_MANAGEMENT_SETUP.md` — guest list backend

---

## Security Considerations

1. Store the web app URL in `content/site.ts` or an environment variable, not in client-side components
2. Consider "Anyone with Google account" instead of "Anyone" for the deployment
3. Add authentication on your Next.js dashboard routes before exposing delete actions
4. Review Apps Script execution logs if responses are not saving

---

## Troubleshooting

### "Identifier 'PROPOSAL_SHEET_NAME' has already been declared"

You have both `proposal-responses-management.js` and `principal-sponsor-management.js`
in the same Apps Script project. Remove one:

- **Keep sponsors + proposals in one deployment** → delete the `ProposalResponses` (or
  proposal-only) file; keep only `principal-sponsor-management.js`
- **Keep separate deployments** → use two Apps Script projects, one file each

Save, then run any function again to confirm the error is gone.

### "ProposalResponses sheet not found"

- Run `initializeProposalResponsesSheet()` from the Apps Script editor
- Confirm the tab name is exactly `ProposalResponses`

### Responses not appearing on the site

- Redeploy the web app after code changes (new version)
- Verify `content/site.ts` → `googleAPI.proposalResponses` matches the latest deployment URL
- Check **View** > **Executions** in Apps Script for errors

### Confirmed guest not in Entourage / Sponsors

- That sync uses separate URLs: `googleAPI.entourage` and `googleAPI.sponsors`
- See `ENTOURAGE_SPONSORS_SETUP.md`
- Proposal logging can succeed even if entourage sync fails

### CORS errors

- Deploy as a **Web app**, not just save the script
- Confirm "Who has access" is set correctly

### Invalid status errors

- Only `Confirmed` and `Declined` are accepted (case-sensitive)

---

## Support

1. Check execution logs: **View** > **Executions**
2. Run `testSetup()` and `testDoGet()` in the script editor
3. Inspect browser network tab when submitting from your site

---

## Changelog

### Version 1.0.0 (2026-06-10)

- Initial release
- GET `?action=proposals`
- POST `action: proposal`
- POST `action: delete-proposal`
- Sheet initialization and sample data helpers
- Optional statistics endpoint

---

Happy planning! 💒💍✨
