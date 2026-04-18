export const inquiryUserEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #193CB8; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.5px; }
    .body { padding: 32px 40px; }
    .body p { color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .highlight { background: #F3F4F6; border-left: 4px solid #193CB8; padding: 16px 20px; border-radius: 6px; margin: 24px 0; }
    .highlight p { margin: 0; color: #0A0A0A; font-weight: 600; font-size: 15px; }
    .footer { background: #F9FAFB; padding: 20px 40px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Inquiry Received</h1>
    </div>
    <div class="body">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for reaching out to us. We have successfully received your inquiry and our team will get back to you as soon as possible.</p>
      <div class="highlight">
        <p>Our team typically responds within 24–48 business hours.</p>
      </div>
      <p>If you have any urgent questions, feel free to contact us directly.</p>
      <p>Best regards,<br /><strong>The Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
`;

export const inquiryAdminEmailTemplate = (data: {
  name: string;
  email: string;
  phone: string;
  destination: string;
  qualification: string;
  test: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #0f172a; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.5px; }
    .body { padding: 32px 40px; }
    .body p { color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #E5E7EB; }
    td:first-child { color: #64748b; font-weight: 600; width: 40%; }
    td:last-child { color: #0A0A0A; }
    .footer { background: #F9FAFB; padding: 20px 40px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Inquiry Submitted</h1>
    </div>
    <div class="body">
      <p>A new inquiry has been submitted. Details below:</p>
      <table>
        <tr><td>Full Name</td><td>${data.name}</td></tr>
        <tr><td>Email</td><td>${data.email}</td></tr>
        <tr><td>Phone</td><td>${data.phone}</td></tr>
        <tr><td>Study Destination</td><td>${data.destination}</td></tr>
        <tr><td>High Qualification</td><td>${data.qualification}</td></tr>
        <tr><td>English Test Status</td><td>${data.test}</td></tr>
      </table>
    </div>
    <div class="footer">
      <p>This is an automated notification from the inquiry system.</p>
    </div>
  </div>
</body>
</html>
`;