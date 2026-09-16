const SHEET_ID = '1UANWaNw7Rdbb5uuhwX_hSdYPlxdqt5pDSOdp-tqugOY';

function doGet() {
  return ContentService.createTextOutput('Bíllinn minn endpoint is running.');
}

function doPost(e) {
  const expectedKey = PropertiesService.getScriptProperties().getProperty('WRITE_KEY');
  if (!expectedKey || String(e.parameter.key || '') !== expectedKey) {
    return json_({ ok: false, error: 'Unauthorized' });
  }

  const car = String(e.parameter.car || '').trim();
  if (!['alex', 'kara'].includes(car)) return json_({ ok: false, error: 'Invalid car' });

  if (car === 'alex') {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Bensín');
    const date = parseDate_(e.parameter.date);
    const cost = number_(e.parameter.cost);
    const litres = number_(e.parameter.litres);
    const odometer = number_(e.parameter.odometer);
    const distance = number_(e.parameter.km);
    const fullTank = clean_(e.parameter.fullTank) || 'Óvíst';
    const station = clean_(e.parameter.station);
    const id = 'F-' + Utilities.formatDate(date, 'Atlantic/Reykjavik', 'yyyyMMdd') + '-' + Utilities.getUuid().slice(0, 4).toUpperCase();
    const pricePerLitre = cost && litres ? cost / litres : '';
    const krPerKm = cost && distance ? cost / distance : '';

    sheet.appendRow([id, date, cost || '', litres || '', odometer || '', distance || '', fullTank, station, pricePerLitre, krPerKm]);
    return json_({ ok: true, car: car, id: id });
  }

  // Kara/Yaris: keep a lightweight log in its own sheet.
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Kara · Yaris');
  if (!sheet) {
    sheet = ss.insertSheet('Kara · Yaris');
    sheet.appendRow(['Móttekið', 'Dagsetning', 'Kostnaður', 'Lítrar', 'Km síðan seinast', 'Athugasemd']);
  }
  sheet.appendRow([new Date(), parseDate_(e.parameter.date), number_(e.parameter.cost) || '', number_(e.parameter.litres) || '', number_(e.parameter.km) || '', clean_(e.parameter.note)]);
  return json_({ ok: true, car: car });
}

function parseDate_(value) {
  const s = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date();
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function number_(value) {
  const n = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function clean_(value) {
  return String(value || '').trim().slice(0, 500);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
