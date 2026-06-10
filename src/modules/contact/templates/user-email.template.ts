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

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#0F4C8A,#193CB8);padding:32px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">${siteName}</h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">We received your message</p>
                </td>
              </tr>

              <!-- Body -->
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

              <!-- Contact Information -->
              <tr>
                <td style="background:#F0F7FF;padding:28px 40px;border-top:2px solid #E5E7EB;">
                  <h2 style="color:#0F4C8A;font-size:17px;margin:0 0 18px;font-weight:700;">📍 Contact Us</h2>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>

                      <!-- Left Column: Offices -->
                      <td width="50%" valign="top" style="padding-right:16px;">

                        <!-- Main Office -->
                        <p style="color:#0F4C8A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px;border-bottom:1px solid #BFDBFE;padding-bottom:4px;">Main Office – Australia</p>
                        <p style="color:#4A5565;font-size:13px;margin:3px 0;line-height:1.5;">Unit-1/88, Bathurst Street,<br/>Liverpool NSW 2170, Australia</p>
                        <p style="color:#4A5565;font-size:13px;margin:3px 0;">📞 <a href="tel:+924235692472" style="color:#0F4C8A;text-decoration:none;">+92 42 3569 2472</a></p>
                        <p style="color:#4A5565;font-size:13px;margin:3px 0;">✉️ <a href="mailto:info@ucms.net.au" style="color:#0F4C8A;text-decoration:none;">info@ucms.net.au</a></p>

                        <!-- Branch Office -->
                        <p style="color:#0F4C8A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 6px;border-bottom:1px solid #BFDBFE;padding-bottom:4px;">Branch Office – Pakistan</p>
                        <p style="color:#4A5565;font-size:13px;margin:3px 0;line-height:1.5;">225-Y, Level-1, Commercial Block,<br/>Phase-3, DHA, Lahore, Pakistan</p>
                        <p style="color:#4A5565;font-size:13px;margin:3px 0;">📞 <a href="tel:+924235692472" style="color:#0F4C8A;text-decoration:none;">+92 42 3569 2472</a></p>
                        <p style="color:#4A5565;font-size:13px;margin:3px 0;">✉️ <a href="mailto:applications@ucms.net.au" style="color:#0F4C8A;text-decoration:none;">applications@ucms.net.au</a></p>

                      </td>

                      <!-- Right Column: Departments -->
                      <td width="50%" valign="top">

                        <p style="color:#0F4C8A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 10px;border-bottom:1px solid #BFDBFE;padding-bottom:4px;">Department Contacts</p>

                        <p style="color:#FF6B35;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin:0;">Study Abroad &amp; Migration</p>
                        <p style="color:#4A5565;font-size:13px;margin:2px 0 10px;">📞 <a href="tel:+923008483375" style="color:#0F4C8A;text-decoration:none;">+92 300 848 3375</a></p>

                        <p style="color:#FF6B35;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin:0;">IT Department</p>
                        <p style="color:#4A5565;font-size:13px;margin:2px 0 10px;">📞 <a href="tel:+923229008855" style="color:#0F4C8A;text-decoration:none;">+92 322 900 8855</a></p>

                        <p style="color:#FF6B35;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin:0;">Academic &amp; Training</p>
                        <p style="color:#4A5565;font-size:13px;margin:2px 0 10px;">📞 <a href="tel:+923214638592" style="color:#0F4C8A;text-decoration:none;">+92 321 463 8592</a></p>

                        <p style="color:#FF6B35;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin:0;">Marketing</p>
                        <p style="color:#4A5565;font-size:13px;margin:2px 0;">✉️ <a href="mailto:marketing@ucms.net.au" style="color:#0F4C8A;text-decoration:none;">marketing@ucms.net.au</a></p>

                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
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