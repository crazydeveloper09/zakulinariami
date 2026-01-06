export const adminReportTemplate = ({ title, reason, reporterEmail }) => `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>

<body style="margin:0; background:#F5F6F4;">
<table width="100%" style="padding:32px 0;">
<tr><td align="center">

<table width="600" style="background:#FFFFFF; border-radius:8px;">
<tr>
<td style="padding:24px;">
  <h2 style="font-family:'DM Sans', Arial; font-size:18px;">
    🚨 Nowe zgłoszenie
  </h2>

  <p style="font-family:'DM Sans', Arial; font-size:14px;">
    <strong>Nazwa:</strong> ${title}<br/>
    <strong>Zgłaszający:</strong> ${reporterEmail}
  </p>

  <p style="font-family:'DM Sans', Arial; font-size:14px;">
    <strong>Powód zgłoszenia:</strong><br/>
    ${reason}
  </p>
</td>
</tr>
</table>

</td></tr>
</table>
</body>
</html>
`;
