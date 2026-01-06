export const verifyCodeTemplate = ({ code }) => `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>

<body style="margin:0; background:#E3E6E1;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
<tr><td align="center">

<table width="560" style="background:#FFFFFF; border-radius:8px;">
<tr>
<td style="background:#1F2428; padding:20px; text-align:center;">
  <span style="font-family:'Playfair Display', Georgia, serif; color:#f5f6fa; font-size:24px; font-weight:600;">
    COOKIETY
  </span>
</td>
</tr>

<tr>
<td style="padding:32px;">
  <h1 style="font-family:'Playfair Display', Georgia, serif; font-size:22px; margin:0 0 16px;">
    Kod weryfikacyjny
  </h1>

  <p style="font-family:'DM Sans', Arial; font-size:15px; line-height:1.6;">
    Aby potwierdzić swoje konto w Cookiety, wpisz poniższy kod:
  </p>

  <div style="
    margin:24px 0;
    padding:16px;
    background:#F5F6F4;
    text-align:center;
    font-family:'DM Sans', Arial;
    font-size:24px;
    font-weight:600;
    letter-spacing:4px;
  ">
    ${code}
  </div>

  <p style="font-family:'DM Sans', Arial; font-size:13px; color:#666;">
    Kod jest ważny przez kilka minut.
  </p>
</td>
</tr>
</table>

</td></tr>
</table>
</body>
</html>
`;
