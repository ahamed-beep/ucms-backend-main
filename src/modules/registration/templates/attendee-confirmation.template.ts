import { IRegistrationMailPayload } from '../interfaces/registration.interface';

export const attendeeConfirmationTemplate = (
  payload: IRegistrationMailPayload,
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Registration Confirmed</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0F4C8A, #193CB8); padding: 40px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-size: 12px; padding: 4px 14px; border-radius: 20px; margin-top: 12px; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; color: #0A0A0A; font-weight: 600; margin-bottom: 8px; }
    .text { font-size: 14px; color: #4A5565; line-height: 1.7; margin-bottom: 24px; }
    .event-card { background: #EFF6FF; border-left: 4px solid #193CB8; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; }
    .event-card h2 { color: #193CB8; font-size: 16px; margin: 0 0 14px; }
    .detail-row { display: flex; align-items: flex-start; margin-bottom: 10px; font-size: 13px; color: #364153; }
    .detail-label { font-weight: 600; min-width: 90px; color: #0A0A0A; }
    .attendee-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .attendee-table th { background: #F3F4F6; text-align: left; font-size: 12px; color: #6A7282; padding: 10px 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .attendee-table td { padding: 10px 14px; font-size: 13px; color: #0A0A0A; border-bottom: 1px solid #E5E7EB; }
    .steps { background: #F9FAFB; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; }
    .steps h3 { font-size: 14px; color: #0A0A0A; margin: 0 0 12px; }
    .step-item { display: flex; align-items: flex-start; margin-bottom: 10px; font-size: 13px; color: #364153; }
    .step-dot { width: 8px; height: 8px; background: #00A63E; border-radius: 50%; margin-top: 4px; margin-right: 10px; flex-shrink: 0; }
    .footer { background: #F3F4F6; padding: 24px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #6A7282; margin: 4px 0; }
    .footer a { color: #193CB8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>✅ Registration Confirmed!</h1>
      <p>You're officially registered for the event below.</p>
      <span class="badge">Uplifts Events</span>
    </div>

    <div class="body">
      <p class="greeting">Hi ${payload.attendeeName},</p>
      <p class="text">
        Thank you for registering! We're excited to have you join us. Here are your event and registration details.
      </p>

      <div class="event-card">
        <h2>${payload.eventTitle}</h2>
        <div class="detail-row"><span class="detail-label">📅 Date:</span><span>${payload.eventDate}</span></div>
        <div class="detail-row"><span class="detail-label">⏰ Time:</span><span>${payload.eventTime}</span></div>
        <div class="detail-row"><span class="detail-label">📍 Location:</span><span>${payload.eventLocation}</span></div>
        <div class="detail-row"><span class="detail-label">👥 Attendees:</span><span>${payload.attendees}</span></div>
      </div>

      <table class="attendee-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Name</td><td>${payload.attendeeName}</td></tr>
          <tr><td>Email</td><td>${payload.attendeeEmail}</td></tr>
          <tr><td>Phone</td><td>${payload.attendeePhone}</td></tr>
        </tbody>
      </table>

      <div class="steps">
        <h3>What Happens Next?</h3>
        <div class="step-item"><div class="step-dot"></div><span>A reminder email will be sent 24 hours before the event.</span></div>
        <div class="step-item"><div class="step-dot"></div><span>Location map and preparation materials will be shared via email.</span></div>
        <div class="step-item"><div class="step-dot"></div><span>Our team may contact you at ${payload.attendeePhone} if needed.</span></div>
        <div class="step-item"><div class="step-dot"></div><span>A certificate of participation will be issued after the event.</span></div>
      </div>

      <p class="text">
        Need to make changes? Contact us at <a href="mailto:events@uplifts.com">events@uplifts.com</a> or call <strong>+1 (234) 567-8900</strong>.
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Uplifts. All rights reserved.</p>
      <p><a href="mailto:events@uplifts.com">events@uplifts.com</a> · +1 (234) 567-8900</p>
    </div>
  </div>
</body>
</html>
`;