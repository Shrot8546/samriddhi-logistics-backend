Quick SMTP mailer for `index.html` quick-quote form

Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` in the project root (copy from `.env.example`) and add your SMTP credentials and `TO_EMAIL` address.

3. Start the mail server:

```bash
npm start
```

This runs an Express server on port defined in `.env` (default 3000) and exposes `/send-quote`.

Client

The quick form in `index.html` posts to `https://samriddhi-logistics-backend.onrender.com/send-quote`. When the server successfully sends the email the form shows a toast confirmation.

Notes

- For production, secure the endpoint (rate limit, captcha, validation) before exposing publicly.
- If using Gmail SMTP, you may need an app-specific password or enable less-secure app access depending on your account settings.
