export const adminNotificationTemplate = (data: {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  highestQualification: string;
  yearsOfExperience: number;
  institutionAffiliation: string;
  currentJobPosition: string;
  previousExperience: string;
  coverLetter: string;
  cvUrl: string;
}): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #0A0A0A; padding: 28px 40px; text-align: center; }
    .header h1 { color: #FF6B35; margin: 0; font-size: 20px; }
    .body { padding: 32px 40px; color: #333333; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    td:first-child { font-weight: bold; color: #555; width: 40%; }
    .cv-link { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #FF6B35; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px; }
    .footer { background: #f9f9f9; padding: 16px 40px; text-align: center; font-size: 12px; color: #888888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Faculty Application</h1>
    </div>
    <div class="body">
      <p style="color:#555; font-size:14px;">A new faculty application has been submitted. Details below:</p>
      <table>
        <tr><td>Full Name</td><td>${data.fullName}</td></tr>
        <tr><td>Email</td><td>${data.email}</td></tr>
        <tr><td>Phone</td><td>${data.phone}</td></tr>
        <tr><td>LinkedIn</td><td>${data.linkedin || 'N/A'}</td></tr>
        <tr><td>Qualification</td><td>${data.highestQualification}</td></tr>
        <tr><td>Experience</td><td>${data.yearsOfExperience} year(s)</td></tr>
        <tr><td>Institution</td><td>${data.institutionAffiliation}</td></tr>
        <tr><td>Current Position</td><td>${data.currentJobPosition}</td></tr>
        <tr><td>Previous Experience</td><td>${data.previousExperience}</td></tr>
        <tr><td>Cover Letter</td><td>${data.coverLetter}</td></tr>
      </table>
      <a href="${data.cvUrl}" class="cv-link">View CV / Resume</a>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} UCMS Admin Panel
    </div>
  </div>
</body>
</html>
`;