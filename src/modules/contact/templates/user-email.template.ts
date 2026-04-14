// templates/user-email.template.ts
export function buildUserEmailTemplate(fullName: string, subject: string, siteName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#0F4C8A,#193CB8);padding:32px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">${siteName}</h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">We received your message</p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px;">
                  <p style="color:#364153;font-size:16px;margin:0 0 16px;">Hi <strong>${fullName}</strong>,</p>
                  <p style="color:#364153;font-size:15px;line-height:1.7;margin:0 0 16px;">
                    Thank you for reaching out! We have received your message regarding
                    <strong>"${subject}"</strong> and our team will get back to you as soon as possible.
                  </p>
                  <p style="color:#364153;font-size:15px;line-height:1.7;margin:0 0 24px;">
                    If you have any urgent concerns, feel free to reply to this email.
                  </p>
                  <div style="background:#F0F4FF;border-left:4px solid #193CB8;border-radius:0 8px 8px 0;padding:16px;color:#364153;font-size:14px;line-height:1.6;">
                    ⏱️ We typically respond within <strong>24–48 business hours</strong>.
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#F9FAFB;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
                  <p style="color:#9CA3AF;font-size:12px;margin:0;">${siteName} &copy; ${new Date().getFullYear()} — This is an automated confirmation email.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}