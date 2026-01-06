export const passwordChangedTemplate = () => `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>

<body style="margin:0; background:#E3E6E1;">
<table width="100%" style="padding:32px 0;">
<tr><td align="center">

<table width="560" style="background:#FFFFFF; border-radius:8px;">
<tr>
<td style="background:#1F2428; padding:20px; text-align:center;">
  <span style="font-family:'Playfair Display', Georgia; color:#f5f6fa; font-size:24px;">
    COOKIETY
  </span>
</td>
</tr>

<tr>
<td style="padding:32px;">
  <h1 style="font-family:'Playfair Display', Georgia; font-size:22px;">
    Hasło zostało zmienione
  </h1>

  <p style="font-family:'DM Sans', Arial; font-size:15px; line-height:1.6;">
    Informujemy, że hasło do Twojego konta Cookiety zostało pomyślnie zmienione.
  </p>

  <p style="font-family:'DM Sans', Arial; font-size:13px; color:#666;">
    Jeśli to nie była Twoja akcja, skontaktuj się z nami natychmiast.
  </p>
</td>
</tr>
</table>

</td></tr>
</table>
</body>
</html>
`;
