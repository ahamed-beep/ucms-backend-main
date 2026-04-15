export const adminNewBookingTemplate = (data: {
  fullName: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  consultationType: string;
  destination?: string;
  qualification?: string;
  additionalInfo?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Consultation Booking</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background-color: #0A0A0A; padding: 28px 40px; text-align: center; }
    .header h1 { color: #FF6B35; margin: 0; font-size: 22px; }
    .header p { color: #9CA3AF; margin: 6px 0 0; font-size: 14px; }
    .body { padding: 32px 40px; }
    .body p { color: #4A5565; font-size: 15px; line-height: 1.6; }
    .section-title { font-size: 13px; font-weight: 700; color: #FF6B35; text-transform: uppercase; letter-spacing: 0.5px; margin: 24px 0 10px; }
    .details-box { background: #F9FAFB; border-radius: 8px; padding: 16px 20px; }
    .detail-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #E5E7EB; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6B7280; font-size: 14px; }
    .detail-value { color: #0A0A0A; font-size: 14px; font-weight: 600; max-width: 60%; text-align: right; }
    .footer { background: #F9FAFB; padding: 20px 40px; text-align: center; }
    .footer p { color: #9CA3AF; font-size: 13px; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🔔 New Consultation Booking</h1>
      <p>A new session has been scheduled</p>
    </div>
    <div class="body">
      <p>A new consultation booking has been received. Please review the details below.</p>

      <div class="section-title">Client Information</div>
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Full Name</span>
          <span class="detail-value">${data.fullName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${data.phone}</span>
        </div>
        ${data.qualification ? `
        <div class="detail-row">
          <span class="detail-label">Qualification</span>
          <span class="detail-value">${data.qualification}</span>
        </div>` : ''}
        ${data.destination ? `
        <div class="detail-row">
          <span class="detail-label">Destination</span>
          <span class="detail-value">${data.destination}</span>
        </div>` : ''}
      </div>

      <div class="section-title">Appointment Details</div>
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
        ${data.additionalInfo ? `
        <div class="detail-row">
          <span class="detail-label">Additional Info</span>
          <span class="detail-value">${data.additionalInfo}</span>
        </div>` : ''}
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} UCMS Admin Panel</p>
    </div>
  </div>
</body>
</html>
`;