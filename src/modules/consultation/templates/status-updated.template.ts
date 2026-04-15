export const statusUpdatedTemplate = (data: {
  fullName: string;
  selectedDate: string;
  selectedTime: string;
  consultationType: string;
  newStatus: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Consultation Status Updated</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background-color: #10B981; padding: 28px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
    .body { padding: 32px 40px; }
    .body p { color: #4A5565; font-size: 15px; line-height: 1.7; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; background: #D1FAE5; color: #065F46; font-size: 14px; font-weight: 700; }
    .details-box { background: #F9FAFB; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #E5E7EB; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6B7280; font-size: 14px; }
    .detail-value { color: #0A0A0A; font-size: 14px; font-weight: 600; }
    .footer { background: #F9FAFB; padding: 20px 40px; text-align: center; }
    .footer p { color: #9CA3AF; font-size: 13px; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📋 Consultation Status Updated</h1>
    </div>
    <div class="body">
      <p>Hi <strong>${data.fullName}</strong>,</p>
      <p>Your consultation status has been updated to: <span class="badge">${data.newStatus.toUpperCase()}</span></p>
      <p>Our team has reviewed your booking and will be in touch with you shortly before your scheduled session.</p>
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${data.selectedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-value">${data.selectedTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Consultation Type</span>
          <span class="detail-value">${data.consultationType}</span>
        </div>
      </div>
      <p>Thank you for choosing UCMS. We look forward to speaking with you!</p>
      <p>Best regards,<br/><strong>UCMS Counseling Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} UCMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;