export const paymentSuccessAdminTemplate = (variables: {
  paymentId: string;
  serviceTitle: string;
  amount: string;
  currency: string;
  paypalOrderId: string;
  paypalCaptureId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentDate: string;
  adminDashboardUrl: string;
  appName: string;
  appUrl: string;
}): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Payment Received</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; color: #333; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1b5e20, #2e7d32); padding: 35px 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    .header p { color: #a5d6a7; font-size: 14px; }
    .alert-banner { background: #e8f5e9; border-left: 4px solid #2e7d32; padding: 14px 20px; margin: 24px 30px 0; border-radius: 0 6px 6px 0; }
    .alert-banner p { font-size: 14px; color: #1b5e20; font-weight: 500; }
    .alert-banner span { font-weight: 700; }
    .body { padding: 24px 30px 35px; }
    .summary-box { background: linear-gradient(135deg, #f1f8e9, #e8f5e9); border: 1px solid #c8e6c9; border-radius: 10px; padding: 20px; margin-bottom: 20px; text-align: center; }
    .summary-box .big-amount { font-size: 36px; font-weight: 800; color: #1b5e20; }
    .summary-box .sub { font-size: 13px; color: #666; margin-top: 4px; }
    .card { background: #f8fffe; border: 1px solid #c8e6c9; border-radius: 10px; padding: 22px; margin-bottom: 20px; }
    .card h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #666; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #e0f2e1; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px dashed #e8f5e9; }
    .detail-row:last-child { border-bottom: none; }
    .detail-row .label { font-size: 13px; color: #777; }
    .detail-row .value { font-size: 13px; font-weight: 600; color: #222; }
    .detail-row .value.amount { color: #2e7d32; font-size: 17px; }
    .badge-completed { display: inline-block; background: #e8f5e9; color: #2e7d32; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid #a5d6a7; }
    .btn-wrapper { text-align: center; margin-top: 24px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #2e7d32, #1b5e20); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; }
    .footer { background: #f8fffe; border-top: 1px solid #e0f2e1; padding: 22px 30px; text-align: center; }
    .footer p { font-size: 12px; color: #999; line-height: 1.8; }
    .footer a { color: #2e7d32; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>💰 New Payment Received</h1>
      <p>A customer has successfully completed their payment</p>
    </div>
    <div class="alert-banner">
      <p>🔔 New payment of <span>${variables.currency} ${variables.amount}</span> received from <span>${variables.customerName}</span></p>
    </div>
    <div class="body">
      <div class="summary-box">
        <div class="big-amount">${variables.currency} ${variables.amount}</div>
        <div class="sub">Payment received for "${variables.serviceTitle}"</div>
      </div>
      <div class="card">
        <h2>📋 Payment Details</h2>
        <div class="detail-row">
          <span class="label">Payment ID</span>
          <span class="value">#${variables.paymentId}</span>
        </div>
        <div class="detail-row">
          <span class="label">PayPal Order ID</span>
          <span class="value">${variables.paypalOrderId}</span>
        </div>
        <div class="detail-row">
          <span class="label">PayPal Capture ID</span>
          <span class="value">${variables.paypalCaptureId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Service</span>
          <span class="value">${variables.serviceTitle}</span>
        </div>
        <div class="detail-row">
          <span class="label">Amount</span>
          <span class="value amount">${variables.currency} ${variables.amount}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date & Time</span>
          <span class="value">${variables.paymentDate}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status</span>
          <span class="value"><span class="badge-completed">✓ COMPLETED</span></span>
        </div>
      </div>
      <div class="card">
        <h2>👤 Customer Details</h2>
        <div class="detail-row">
          <span class="label">Full Name</span>
          <span class="value">${variables.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Email</span>
          <span class="value">${variables.customerEmail}</span>
        </div>
        <div class="detail-row">
          <span class="label">Phone</span>
          <span class="value">${variables.customerPhone}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>
        This is an automated notification from <strong>${variables.appName}</strong> Admin Panel.<br/>
        <a href="${variables.appUrl}">${variables.appUrl}</a>
      </p>
    </div>
  </div>
</body>
</html>`;