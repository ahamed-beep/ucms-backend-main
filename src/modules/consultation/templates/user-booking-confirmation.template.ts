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
    .contact-section { padding: 28px 40px; background: #F0F7FF; border-top: 2px solid #E5E7EB; }
    .contact-section h2 { color: #0F4C8A; font-size: 17px; margin: 0 0 18px 0; }
    .contact-grid { display: table; width: 100%; }
    .contact-col { display: table-cell; vertical-align: top; width: 50%; padding-right: 16px; }
    .contact-col:last-child { padding-right: 0; }
    .contact-office { margin-bottom: 18px; }
    .contact-office h3 { color: #0F4C8A; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px 0; border-bottom: 1px solid #BFDBFE; padding-bottom: 4px; }
    .contact-office p { color: #4A5565; font-size: 13px; margin: 3px 0; line-height: 1.5; }
    .contact-office a { color: #0F4C8A; text-decoration: none; }
    .dept-section h3 { color: #0F4C8A; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 1px solid #BFDBFE; padding-bottom: 4px; }
    .dept-row { margin-bottom: 8px; }
    .dept-name { color: #FF6B35; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; margin: 0; }
    .dept-contact { color: #4A5565; font-size: 13px; margin: 2px 0 0 0; }
    .dept-contact a { color: #0F4C8A; text-decoration: none; }
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
    <div class="footer">
      <p>© ${new Date().getFullYear()} UCMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;