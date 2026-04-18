import { IRegistrationMailPayload } from '../interfaces/registration.interface';

export const adminNotificationTemplate = (
  payload: IRegistrationMailPayload,
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Event Registration</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 36px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.75); margin: 8px 0 0; font-size: 13px; }
    .alert-badge { display: inline-block; background: #FF6B35; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 16px; border-radius: 20px; margin-top: 12px; }
    .body { padding: 32px; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #193CB8; margin-bottom: 14px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #E5E7EB; }
    .info-table td:first-child { font-weight: 600; color: #0A0A0A; width: 40%; background: #F9FAFB; }
    .info-table td:last-child { color: #364153; }
    .event-box { background: #EFF6FF; border-radius: 8px; padding: 18px 22px; margin-bottom: 24px; border-left: 4px solid #193CB8; }
    .event-box h2 { color: #193CB8; font-size: 15px; margin: 0 0 10px; }
    .event-box p { font-size: 13px; color: #364153; margin: 4px 0; }
    .status-pill { display: inline-block; background: #DCFCE7; color: #008236; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
    .footer { background: #F3F4F6; padding: 22px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #6A7282; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🔔 New Registration Received</h1>
      <p>A new attendee has registered for an upcoming event.</p>
      <span class="alert-badge">Admin Notification</span>
    </div>

    <div class="body">
      <p class="section-title">Event Details</p>
      <div class="event-box">
        <h2>${payload.eventTitle}</h2>
        <p>📅 ${payload.eventDate} &nbsp;·&nbsp; ⏰ ${payload.eventTime}</p>
        <p>📍 ${payload.eventLocation}</p>
        <p>👥 Attendees: <strong>${payload.attendees}</strong></p>
      </div>

      <p class="section-title">Attendee Information</p>
      <table class="info-table">
        <tr><td>Full Name</td><td>${payload.attendeeName}</td></tr>
        <tr><td>Email</td><td>${payload.attendeeEmail}</td></tr>
        <tr><td>Phone</td><td>${payload.attendeePhone}</td></tr>
        <tr><td>No. of Attendees</td><td>${payload.attendees}</td></tr>
        <tr><td>Registration Status</td><td><span class="status-pill">New</span></td></tr>
        <tr><td>Registered At</td><td>${new Date().toLocaleString('en-GB')}</td></tr>
      </table>

      <p style="font-size:13px;color:#4A5565;">
        Log in to the admin panel to review, confirm, or manage this registration.
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Uplifts Admin Panel</p>
      <p>This is an automated notification — do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;