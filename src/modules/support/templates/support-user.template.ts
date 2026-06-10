export const supportUserTemplate = (fullName: string, subject: string, message: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #0F4C8A; padding: 28px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; }
    .body { padding: 32px; color: #364153; }
    .body p { font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
    .box { background: #f8fafc; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; }
    .box p { margin: 0; font-size: 14px; color: #4A5565; }
    .contact-section { padding: 28px 32px; background: #F0F7FF; border-top: 2px solid #E5E7EB; }
    .contact-section h2 { color: #0F4C8A; font-size: 17px; margin: 0 0 18px 0; }
    .contact-grid { display: table; width: 100%; }
    .contact-col { display: table-cell; vertical-align: top; width: 50%; padding-right: 16px; }
    .contact-col:last-child { padding-right: 0; }
    .contact-office { margin-bottom: 18px; }
    .contact-office h3 { color: #0F4C8A; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px 0; border-bottom: 1px solid #BFDBFE; padding-bottom: 4px; }
    .contact-office p { color: #4A5565; font-size: 13px; margin: 3px 0; line-height: 1.5; }
    .contact-office a { color: #0F4C8A; text-decoration: none; }
    .dept-section h3 { color: #0F4C8A; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 1px solid #BFDBFE; padding-bottom: 4px; }
    .dept-row { margin-bottom: 8px; }
    .dept-name { color: #FF6B35; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; margin: 0; }
    .dept-contact { color: #4A5565; font-size: 13px; margin: 2px 0 0 0; }
    .dept-contact a { color: #0F4C8A; text-decoration: none; }
    .footer { padding: 20px 32px; background: #f8fafc; text-align: center; }
    .footer p { font-size: 12px; color: #9AA3AF; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Support Request Received</h1></div>
    <div class="body">
      <p>Hi <strong>${fullName}</strong>,</p>
      <p>We have received your support request. Our team will get back to you within 24 hours.</p>
      <div class="box">
        <p><strong>Subject:</strong> ${subject}</p>
      </div>
      <div class="box">
        <p><strong>Your Message:</strong><br/>${message}</p>
      </div>
      <p>If you have any additional information to share, simply reply to this email.</p>
    </div>
    <div class="contact-section">
      <h2>📍 Contact Us</h2>
      <div class="contact-grid">
        <div class="contact-col">
          <div class="contact-office">
            <h3>Main Office – Australia</h3>
            <p>Unit-1/88, Bathurst Street,<br/>Liverpool NSW 2170, Australia</p>
            <p>📞 <a href="tel:+924235692472">+92 42 3569 2472</a></p>
            <p>✉️ <a href="mailto:info@ucms.net.au">info@ucms.net.au</a></p>
          </div>
          <div class="contact-office">
            <h3>Branch Office – Pakistan</h3>
            <p>225-Y, Level-1, Commercial Block,<br/>Phase-3, DHA, Lahore, Pakistan</p>
            <p>📞 <a href="tel:+924235692472">+92 42 3569 2472</a></p>
            <p>✉️ <a href="mailto:applications@ucms.net.au">applications@ucms.net.au</a></p>
          </div>
        </div>
        <div class="contact-col">
          <div class="dept-section">
            <h3>Department Contacts</h3>
            <div class="dept-row">
              <p class="dept-name">Study Abroad &amp; Migration</p>
              <p class="dept-contact">📞 <a href="tel:+923008483375">+92 300 848 3375</a></p>
            </div>
            <div class="dept-row">
              <p class="dept-name">IT Department</p>
              <p class="dept-contact">📞 <a href="tel:+923229008855">+92 322 900 8855</a></p>
            </div>
            <div class="dept-row">
              <p class="dept-name">Academic &amp; Training</p>
              <p class="dept-contact">📞 <a href="tel:+923214638592">+92 321 463 8592</a></p>
            </div>
            <div class="dept-row">
              <p class="dept-name">Marketing</p>
              <p class="dept-contact">✉️ <a href="mailto:marketing@ucms.net.au">marketing@ucms.net.au</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer"><p>&copy; ${new Date().getFullYear()} Upskills. All rights reserved.</p></div>
  </div>
</body>
</html>
`;