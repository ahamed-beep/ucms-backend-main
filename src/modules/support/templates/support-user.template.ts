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
    <div class="footer"><p>&copy; ${new Date().getFullYear()} Upskills. All rights reserved.</p></div>
  </div>
</body>
</html>
`;