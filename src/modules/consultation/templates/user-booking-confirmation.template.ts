export const userBookingConfirmationTemplate = (data: {
  fullName: string;
  selectedDate: string;
  selectedTime: string;
  consultationType: string;
  destination?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmed</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background-color: #FF6B35; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .body { padding: 32px 40px; }
    .body p { color: #4A5565; font-size: 15px; line-height: 1.7; }
    .details-box { background: #F9FAFB; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB; }
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
      <h1>✅ Booking Confirmed!</h1>
    </div>
    <div class="body">
      <p>Hi <strong>${data.fullName}</strong>,</p>
      <p>Your free consultation has been successfully booked. Our counselor will connect with you at the scheduled time. Here are your booking details:</p>
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
        ${data.destination ? `
        <div class="detail-row">
          <span class="detail-label">Preferred Destination</span>
          <span class="detail-value">${data.destination}</span>
        </div>` : ''}
      </div>
      <p>If you need to reschedule or have any questions, feel free to reach out to us.</p>
      <p>Best regards,<br/><strong>UCMS Counseling Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} UCMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;