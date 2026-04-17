export const paymentSuccessUserTemplate = (variables: {
  paymentId: string;
  serviceTitle: string;
  amount: string;
  currency: string;
  paypalOrderId: string;
  customerName: string;
  customerEmail: string;
  paymentDate: string;
  appName: string;
  appUrl: string;
}): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Successful</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; color: #333; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a73e8, #0d47a1); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 26px; font-weight: 700; margin-bottom: 6px; }
    .header p { color: #bbdefb; font-size: 14px; }
    .body { padding: 35px 30px; }
    .greeting { font-size: 16px; margin-bottom: 20px; color: #444; }
    .greeting span { font-weight: 600; color: #1a73e8; }
    .card { background: #f8faff; border: 1px solid #dce8ff; border-radius: 10px; padding: 24px; margin-bottom: 24px; }
    .card h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 16px; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eef2ff; }
    .detail-row:last-child { border-bottom: none; }
    .detail-row .label { font-size: 14px; color: #666; }
    .detail-row .value { font-size: 14px; font-weight: 600; color: #222; }
    .detail-row .value.amount { color: #1a73e8; font-size: 18px; }
    .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
    .message { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px; }
    .btn-wrapper { text-align: center; margin-bottom: 24px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #1a73e8, #0d47a1); color: #ffffff; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-size: 15px; font-weight: 600; }
    .footer { background: #f8faff; border-top: 1px solid #e8edf5; padding: 24px 30px; text-align: center; }
    .footer p { font-size: 12px; color: #999; line-height: 1.8; }
    .footer a { color: #1a73e8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>✅ Payment Successful!</h1>
      <p>Your transaction has been completed successfully</p>
    </div>
    <div class="body">
      <p class="greeting">Hi <span>${variables.customerName}</span>,</p>
      <p class="message">
        Thank you for your payment! We have received your payment and your order is now confirmed.
        Below are your payment details for your records.
      </p>
      <div class="card">
        <h2>Payment Details</h2>
        <div class="detail-row">
          <span class="label">Payment ID</span>
          <span class="value">#${variables.paymentId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Service</span>
          <span class="value">${variables.serviceTitle}</span>
        </div>
        <div class="detail-row">
          <span class="label">Amount Paid</span>
          <span class="value amount">${variables.currency} ${variables.amount}</span>
        </div>
        <div class="detail-row">
          <span class="label">PayPal Order ID</span>
          <span class="value">${variables.paypalOrderId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date</span>
          <span class="value">${variables.paymentDate}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status</span>
          <span class="value"><span class="badge">✓ Completed</span></span>
        </div>
      </div>
      <div class="card">
        <h2>Customer Information</h2>
        <div class="detail-row">
          <span class="label">Name</span>
          <span class="value">${variables.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Email</span>
          <span class="value">${variables.customerEmail}</span>
        </div>
      </div>
      <p class="message">
        If you have any questions about your payment or service, feel free to reach out to our support team.
      </p>
      <div class="btn-wrapper">
        <a href="${variables.appUrl}" class="btn">Visit Our Website</a>
      </div>
    </div>
    <div class="footer">
      <p>
        This is an automated email from <strong>${variables.appName}</strong>.<br/>
        Please do not reply directly to this email.<br/>
        <a href="${variables.appUrl}">${variables.appUrl}</a>
      </p>
    </div>
  </div>
</body>
</html>`;