# RUCF Newsletter Backend

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

Use one of these on Railway.

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

## CORS

Allow the GitHub Pages origin:

```text
NEWSLETTER_ALLOWED_ORIGINS=https://lucasyanzy.github.io,http://127.0.0.1:3001
```

## Local Test

```bash
NEWSLETTER_LOCAL_FILE=.newsletter/subscribers.json npm run newsletter:server
```

Then POST to:

```text
http://127.0.0.1:3000/api/newsletter
```
