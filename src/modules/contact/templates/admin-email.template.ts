import { ContactDocument } from '../entity/contact.entity';

export function buildAdminEmailTemplate(contact: ContactDocument, siteName: string): string {
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
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">New Contact Message Received</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px 0;text-align:center;">
                  <span style="display:inline-block;background:#FFF3CD;color:#856404;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid #FFEAA7;">
                    🔔 NEW MESSAGE
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                        <strong style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">From</strong>
                        <p style="margin:4px 0 0;color:#0A0A0A;font-size:15px;font-weight:600;">${contact.fullName}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                        <strong style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email</strong>
                        <p style="margin:4px 0 0;color:#0F4C8A;font-size:15px;">
                          <a href="mailto:${contact.email}" style="color:#0F4C8A;text-decoration:none;">${contact.email}</a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                        <strong style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Phone</strong>
                        <p style="margin:4px 0 0;color:#0A0A0A;font-size:15px;">${contact.phone}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                        <strong style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Subject</strong>
                        <p style="margin:4px 0 0;color:#0A0A0A;font-size:15px;font-weight:600;">${contact.subject}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 0 0;">
                        <strong style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Message</strong>
                        <div style="margin:8px 0 0;background:#F9FAFB;border-left:4px solid #0F4C8A;border-radius:0 8px 8px 0;padding:16px;color:#364153;font-size:14px;line-height:1.7;">
                          ${contact.message}
                        </div>
                      </td>
                    </tr>
                  </table>
                  <div style="margin-top:28px;text-align:center;">
                    <p style="color:#6B7280;font-size:12px;margin:0;">
                      Received on ${new Date(contact.createdAt as unknown as Date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#F9FAFB;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
                  <p style="color:#9CA3AF;font-size:12px;margin:0;">${siteName} Admin Panel &copy; ${new Date().getFullYear()}</p>
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