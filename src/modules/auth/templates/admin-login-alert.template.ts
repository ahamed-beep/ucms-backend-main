export function getAdminLoginAlertTemplate(
  firstName: string,
  lastName: string,
  email: string,
  loginTime: string,
  resetPasswordUrl: string,
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <h2 style="color: #DC2626;">Admin Login Alert</h2>
      <p>A new admin login was detected on your account:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
        <tr><td style="padding: 6px 0;"><strong>Name:</strong></td><td>${firstName} ${lastName}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>Date & Time:</strong></td><td>${loginTime}</td></tr>
      </table>
      <p>If this wasn't you, please reset your password immediately:</p>
      <a href="${resetPasswordUrl}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 6px;">
        Reset Password
      </a>
    </div>
  `;
}