# HEANG.SONITA — Portfolio

Simple static site containing `index.html`, `resume.html`, and `contact.html`.

How to view locally:

1. Open the `portfolio` folder in VS Code or file explorer.
2. Open `index.html` in a browser (double-click) or use a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Serve and open http://localhost:8000
```

Interactive features:

- Theme toggle: click the moon button in the header to switch dark/light mode (preference saved to localStorage).
- Mobile menu: the ☰ button toggles the navbar on small screens.
- Contact form: the contact page has a JS-handled form (validation + toast). Currently it logs submissions to the console; integrate an API to send messages.

Files added for interactivity: `assets/js/script.js` (shared site behaviors).

Contact form endpoint:

- To enable sending messages to an API, open `contact.html` and set the `data-endpoint` attribute on the `<form id="contact-form">` element to your POST endpoint (for example a Formspree endpoint or your own server URL).
- The JS will POST JSON `{ name, email, message }` to that endpoint and show success/failure toasts. If `data-endpoint` is empty, the form only logs to the console.

Example (Formspree):

```html
<form id="contact-form" data-endpoint="https://formspree.io/f/{your-id}">
  ...
</form>
```

Local Node receiver example:

1. Install dependencies:

```bash
npm install express
```

2. Start the API server:

```bash
npm run serve-api
```

3. Set the form endpoint in `contact.html`:

```html
<form id="contact-form" data-endpoint="http://localhost:3000/api/contact">
  ...
</form>
```

Submissions will return JSON { status: 'ok' } on success and are logged to the console.

Email forwarding (optional)

1. Install the mail dependencies:

```bash
npm install nodemailer dotenv
```

2. Copy `.env.example` to `.env` and fill in your SMTP credentials and addresses. Example values are in `.env.example`.

3. Restart the API server (`npm run serve-api`). If SMTP is configured, the server will attempt to send incoming contact messages as emails. If SMTP is not configured or `nodemailer` is not installed, the server will log submissions to the console and still respond with `{ status: 'ok', note: 'no_smtp_configured' }`.

Security note: Do not commit your real SMTP credentials to source control; keep `.env` out of Git.

Notes:

- The full original HTML content was provided by the user; these pages include abbreviated versions for quick local viewing. Replace contents with the provided full HTML if desired.
