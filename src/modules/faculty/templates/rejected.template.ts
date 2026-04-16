export const rejectedTemplate = (fullName: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #C62828; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
    .body { padding: 32px 40px; color: #333333; }
    .body p { line-height: 1.7; font-size: 15px; }
    .highlight { background: #FFF5F5; border-left: 4px solid #C62828; padding: 12px 16px; border-radius: 4px; margin: 20px 0; }
    .footer { background: #f9f9f9; padding: 20px 40px; text-align: center; font-size: 12px; color: #888888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Application Status Update</h1>
    </div>
    <div class="body">
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>Thank you for your interest in joining our Education Faculty. After careful review, we regret to inform you that we are unable to move forward with your application at this time.</p>
      <div class="highlight">
        <p style="margin:0;">We appreciate the time and effort you put into your application. We encourage you to apply again in the future when new positions become available.</p>
      </div>
      <p>We wish you all the best in your career.</p>
      <p>Best regards,<br/><strong>UCMS Recruitment Team</strong></p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} UCMS. All rights reserved.
    </div>
  </div>
</body>
</html>
`;