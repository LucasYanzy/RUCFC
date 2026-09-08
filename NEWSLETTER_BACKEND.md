# RUCFC Newsletter Backend

The website is exported as a static GitHub Pages site, so newsletter collection runs as a small standalone Node server.

## Railway

Railway uses `railway.json` and starts:

```bash
npm run newsletter:server
```

The public endpoint will be:

```text
https://<your-railway-service>.up.railway.app/api/newsletter
```

Set this GitHub repository variable for the Pages build:

```text
NEXT_PUBLIC_NEWSLETTER_ENDPOINT=https://<your-railway-service>.up.railway.app/api/newsletter
```

## Storage Options

**Every backend you configure runs on each signup, and the response reports which
ones accepted the address** (`{"ok":true,"storedIn":"local+resend"}`). Configuring
a local file alongside a remote list therefore gives you a complete backup of it
rather than nothing. Writing the same address twice is harmless: Resend and GitHub
both key subscribers by address, and the local file counts repeats.

A signup is only rejected with a 503 if *every* configured backend failed. A partial
failure returns 200 — the address is not lost — and logs which backend needs
reconciling, so check the server log if a name is missing downstream.

Resend (the current production backend):

```text
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
```

Create the audience in the Resend dashboard under **Audiences**; the id is the UUID
in its URL. Adding contacts needs no verified domain — that is only required to
*send* mail to the list.

Webhook:

```text
NEWSLETTER_WEBHOOK_URL=
NEWSLETTER_WEBHOOK_SECRET=
```

Private GitHub storage:

```text
NEWSLETTER_GITHUB_TOKEN=
NEWSLETTER_GITHUB_OWNER=
NEWSLETTER_GITHUB_REPO=
NEWSLETTER_GITHUB_BRANCH=main
NEWSLETTER_GITHUB_PATH=newsletter/subscribers.json
```

Use a private repository for subscriber emails. Do not store subscriber emails in the public website repo.

Local file (also used as the on-server backup in production):

```text
NEWSLETTER_LOCAL_FILE=/root/rucfc-newsletter/subscribers.json
```

## CORS

List every origin that serves the site — both deployments post to the same endpoint:

```text
NEWSLETTER_ALLOWED_ORIGINS=https://rucfc.gotclass.xyz,https://lucasyanzy.github.io
```

The check only rejects a request that sends a disallowed `Origin`. A request with no
`Origin` header at all still passes, so this stops other websites from posting on a
visitor's behalf but does nothing against a direct client such as curl.

## Local Test

```bash
NEWSLETTER_LOCAL_FILE=.newsletter/subscribers.json npm run newsletter:server
```

Then POST to:

```text
http://127.0.0.1:3000/api/newsletter
```
