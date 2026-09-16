# Bíllinn minn → Google Sheets

The website fuel form is ready to post to `Bíllinn minn – rekstur og viðhald`.

## One-time setup

1. Open https://script.google.com/ while signed into the Google account that owns the Sheet.
2. Create a new project named `Bíllinn minn backend`.
3. Replace the default code with the contents of `Code.gs` in this folder.
4. In Apps Script, open **Project Settings → Script properties** and add a property named `WRITE_KEY` with a private value you choose.
5. Click **Deploy → New deployment → Web app**.
6. Set **Execute as: Me** and **Who has access: Anyone**.
7. Deploy and copy the `/exec` Web App URL.
8. Put that URL into `/config.js` as `window.BILLINN_SCRIPT_URL = '...';`.
9. On the website, open **🔐 Tenging við Google Sheet** once and enter the same private WRITE_KEY. It stays only in that browser's local storage.

Alex/Sirion entries append to the existing `Bensín` tab. Kara/Yaris entries go to a lightweight `Kara · Yaris` tab that the script creates automatically on first use.
