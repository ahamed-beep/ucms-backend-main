export const supportAdminTemplate = (fullName: string, email: string, subject: string, message: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #101828; padding: 28px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; }
    .body { padding: 32px; color: #364153; }
    .body p { font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
    .box { background: #f8fafc; border-radius: 8px; padding: 16px 20px; margin-bottom: 12px; }
    .box p { margin: 0; font-size: 14px; color: #4A5565; }
    .footer { padding: 20px 32px; background: #f8fafc; text-align: center; }
    .footer p { font-size: 12px; color: #9AA3AF; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>New Support Request</h1></div>
    <div class="body">
      <p>A new support request has been submitted.</p>
      <div class="box"><p><strong>Name:</strong> ${fullName}</p></div>
      <div class="box"><p><strong>Email:</strong> ${email}</p></div>
      <div class="box"><p><strong>Subject:</strong> ${subject}</p></div>
      <div class="box"><p><strong>Message:</strong><br/>${message}</p></div>
    </div>
    <div class="footer"><p>&copy; ${new Date().getFullYear()} Upskills Admin Panel</p></div>
  </div>
</body>
</html>
`;