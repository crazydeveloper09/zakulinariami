export const resetPasswordLinkTemplate = ({ resetUrl }) => `
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

<table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF; border-radius:8px; overflow:hidden;">

  <!-- Header -->
  <tr>
    <td style="background:#1F2428; padding:20px; text-align:center;">
      <span style="
        font-family:'Playfair Display', Georgia, serif;
        font-size:24px;
        font-weight:600;
        color:#f5f6fa;
        letter-spacing:1px;
      ">
        COOKIETY
      </span>
    </td>
  </tr>

  <!-- Content -->
  <tr>
    <td style="padding:32px;">
      <h1 style="
        margin:0 0 16px 0;
        font-family:'Playfair Display', Georgia, serif;
        font-size:22px;
        font-weight:500;
        color:#1F2428;
      ">
        Zresetuj hasło
      </h1>

      <p style="
        margin:0 0 24px 0;
        font-family:'DM Sans', Arial, sans-serif;
        font-size:15px;
        line-height:1.6;
        color:#333333;
      ">
        Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta Cookiety.
        Kliknij przycisk poniżej, aby ustawić nowe hasło.
      </p>

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#6F8F7A; border-radius:6px;">
            <a href="${resetUrl}" target="_blank" style="
              display:inline-block;
              padding:12px 24px;
              font-family:'DM Sans', Arial, sans-serif;
              font-size:14px;
              font-weight:600;
              color:#FFFFFF;
              text-decoration:none;
            ">
              Ustaw nowe hasło
            </a>
          </td>
        </tr>
      </table>

      <!-- Fallback link -->
      <p style="
        margin:24px 0 0 0;
        font-family:'DM Sans', Arial, sans-serif;
        font-size:13px;
        color:#666666;
        line-height:1.5;
      ">
        Jeśli przycisk nie działa, skopiuj i wklej poniższy link do przeglądarki:<br/>
        <a href="${resetUrl}" style="color:#6F8F7A; word-break:break-all;">
          ${resetUrl}
        </a>
      </p>

      <p style="
        margin:16px 0 0 0;
        font-family:'DM Sans', Arial, sans-serif;
        font-size:13px;
        color:#666666;
      ">
        Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.
      </p>
    </td>
  </tr>

</table>

</td></tr>
</table>
</body>
</html>
`;
