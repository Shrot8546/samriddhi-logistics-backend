require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const smtpHost = process.env.SMTP_HOST;
if (!smtpHost) console.warn('SMTP_HOST not set — emails will fail until you configure .env');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEnquiryMail(req, res) {
  const payload = req.body || {};
  const name = (payload.name || '').trim();
  const phone = (payload.phone || '').trim();
  const service = (payload.service || '').trim();
  const pickup = (payload.pickup || '').trim();
  const drop = (payload.drop || '').trim();
  const date = (payload.date || '').trim();
  const message = (payload.message || '').trim();
  const formType = payload.formType || (pickup || drop || date || message ? 'contact' : 'quick');

  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
  if (!process.env.TO_EMAIL) return res.status(500).json({ error: 'TO_EMAIL is not configured' });

  const mail = {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.TO_EMAIL,
    subject: `${formType === 'contact' ? 'Contact' : 'Quick Quote'} request — ${name}`,
    text: [
      `Form: ${formType}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      service ? `Service: ${service}` : null,
      pickup ? `Pickup: ${pickup}` : null,
      drop ? `Drop: ${drop}` : null,
      date ? `Moving Date: ${date}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean).join('\n'),
    html: `
      <p><strong>Form:</strong> ${formType}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
      ${pickup ? `<p><strong>Pickup:</strong> ${pickup}</p>` : ''}
      ${drop ? `<p><strong>Drop:</strong> ${drop}</p>` : ''}
      ${date ? `<p><strong>Moving Date:</strong> ${date}</p>` : ''}
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
    `,
  };

  try {
    await transporter.sendMail(mail);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Mail send error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Failed to send email', details: err && err.message });
  }
}
app.get('/', (req, res) => {
  res.send('Samriddhi Logistics Backend Running 🚚');
});
app.post('/send-quote', sendEnquiryMail);
app.post('/send-contact', sendEnquiryMail);
app.post('/send-enquiry', sendEnquiryMail);

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => console.log(`Mail server listening on ${port}`));
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
