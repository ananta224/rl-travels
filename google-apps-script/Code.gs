/**
 * RL Travels – Google Apps Script
 * ════════════════════════════════════════════════════════════
 * This script receives enquiry form submissions from the website
 * and appends each entry as a new row in a Google Sheet.
 *
 * SETUP INSTRUCTIONS (one-time, ~5 minutes)
 * ════════════════════════════════════════════════════════════
 *
 * STEP 1 – Create a Google Sheet
 * ─────────────────────────────
 *   1. Go to https://sheets.google.com
 *   2. Create a new spreadsheet
 *   3. Name it "RL Travels – Enquiries"
 *   4. Copy the Sheet ID from the URL:
 *      https://docs.google.com/spreadsheets/d/  ← THIS PART →  /edit
 *   5. Paste it into SHEET_ID below.
 *
 * STEP 2 – Open Apps Script
 * ─────────────────────────
 *   1. In your Google Sheet, go to Extensions → Apps Script
 *   2. Delete any existing code in the editor
 *   3. Paste the entire contents of THIS file
 *   4. Click Save (💾)
 *
 * STEP 3 – Deploy as Web App
 * ──────────────────────────
 *   1. Click Deploy → New deployment
 *   2. Click the gear icon ⚙ next to "Select type" → Web app
 *   3. Set Description: "RL Travels Enquiry Form v1"
 *   4. Set Execute as: "Me"
 *   5. Set Who has access: "Anyone"      ← Important!
 *   6. Click Deploy
 *   7. Click "Authorize access" and allow the permissions
 *   8. Copy the Web App URL (looks like: https://script.google.com/macros/s/.../exec)
 *
 * STEP 4 – Connect to your website
 * ─────────────────────────────────
 *   1. Open index.html
 *   2. Find the <form> tag with data-sheet-url="..."
 *   3. Replace PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
 *      with the URL you copied in Step 3
 *
 * STEP 5 – Test it
 * ────────────────
 *   1. Open your website
 *   2. Fill and submit the enquiry form
 *   3. Check your Google Sheet — a new row should appear!
 *
 * ════════════════════════════════════════════════════════════
 * OPTIONAL: EMAIL NOTIFICATION
 * ════════════════════════════════════════════════════════════
 * To get an email whenever someone submits an enquiry:
 *   1. Set NOTIFY_EMAIL below to your email address
 *   2. Set SEND_EMAIL_NOTIFICATION = true
 * ════════════════════════════════════════════════════════════
 */

/* ── Configuration ───────────────────────────────────────── */

var SHEET_ID  = '152aZxA9evsNF6zf0SFSE80yxg0fLy7UaZEr18sMG7t4';
// Example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms'

var SHEET_TAB = 'Enquiries';
// Name of the tab/sheet where entries are saved

var SEND_EMAIL_NOTIFICATION = false;
// Set to true to receive email for each new enquiry

var NOTIFY_EMAIL = 'your@email.com';
// Your email address for notifications

/* ── Column headers ──────────────────────────────────────── */

var HEADERS = [
  'Timestamp (IST)',
  'Full Name',
  'Phone Number',
  'Travel Date',
  'Vehicle Type',
  'Message',
  'Source URL',
];

/* ── Main handler ────────────────────────────────────────── */

/**
 * doPost – Called by the website form on submission.
 * Receives JSON, writes a row to the sheet, optionally sends email.
 */
function doPost(e) {
  try {
    /* 1. Parse the incoming JSON payload */
    var raw     = e.postData && e.postData.contents ? e.postData.contents : '{}';
    var payload = JSON.parse(raw);

    /* 2. Open the spreadsheet and get (or create) the target sheet */
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = getOrCreateSheet(ss, SHEET_TAB);

    /* 3. Add headers if the sheet is empty */
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      formatHeaderRow(sheet);
    }

    /* 4. Build and append the data row */
    var row = [
      payload.submittedAt  || new Date().toLocaleString('en-IN'),
      payload.name         || '',
      payload.phone        || '',
      payload.travelDate   || '',
      payload.vehicle      || '',
      payload.message      || '',
      payload.source       || '',
    ];

    sheet.appendRow(row);

    /* 5. Auto-resize columns for readability */
    sheet.autoResizeColumns(1, HEADERS.length);

    /* 6. Optional email notification */
    if (SEND_EMAIL_NOTIFICATION && NOTIFY_EMAIL) {
      sendEmailNotification(payload);
    }

    /* 7. Return success */
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Enquiry saved.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    /* Log the error and return a 200 with error details (fetch uses no-cors) */
    console.error('RL Travels Apps Script error:', err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet – Health check endpoint.
 * Visit the Web App URL in a browser to verify it's deployed correctly.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status:  'ok',
      service: 'RL Travels Enquiry Form',
      time:    new Date().toLocaleString('en-IN'),
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── Helpers ─────────────────────────────────────────────── */

/**
 * getOrCreateSheet – Returns the named sheet, creating it if absent.
 */
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * formatHeaderRow – Bold + freeze the first row, set column widths.
 */
function formatHeaderRow(sheet) {
  var header = sheet.getRange(1, 1, 1, HEADERS.length);

  header.setFontWeight('bold');
  header.setBackground('#E8670A');
  header.setFontColor('#FFFFFF');
  header.setHorizontalAlignment('center');

  sheet.setFrozenRows(1);

  /* Set sensible default column widths */
  sheet.setColumnWidth(1, 160); // Timestamp
  sheet.setColumnWidth(2, 160); // Name
  sheet.setColumnWidth(3, 140); // Phone
  sheet.setColumnWidth(4, 120); // Travel Date
  sheet.setColumnWidth(5, 200); // Vehicle
  sheet.setColumnWidth(6, 340); // Message
  sheet.setColumnWidth(7, 260); // Source URL
}

/**
 * sendEmailNotification – Sends a formatted email for each new enquiry.
 */
function sendEmailNotification(payload) {
  var subject = '\uD83D\uDE90 New Enquiry – ' + (payload.name || 'Unknown') + ' | RL Travels';

  var body = [
    'A new travel enquiry has been submitted on your website.\n',
    '─────────────────────────────',
    'Name        : ' + (payload.name        || '—'),
    'Phone       : ' + (payload.phone       || '—'),
    'Travel Date : ' + (payload.travelDate  || '—'),
    'Vehicle     : ' + (payload.vehicle     || '—'),
    'Message     : ' + (payload.message     || '—'),
    '─────────────────────────────',
    'Submitted   : ' + (payload.submittedAt || '—'),
    'Source      : ' + (payload.source      || '—'),
    '\nView all enquiries in your Google Sheet.',
  ].join('\n');

  var htmlBody = '<div style="font-family:Arial,sans-serif;max-width:560px;">'
    + '<div style="background:#E8670A;padding:20px 24px;border-radius:8px 8px 0 0;">'
    + '<h2 style="color:#fff;margin:0;font-size:20px;">🚐 New Enquiry – RL Travels</h2>'
    + '</div>'
    + '<div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 8px 8px;">'
    + '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
    + row_('Name',         payload.name)
    + row_('Phone',        payload.phone)
    + row_('Travel Date',  payload.travelDate)
    + row_('Vehicle',      payload.vehicle)
    + row_('Message',      payload.message)
    + row_('Submitted',    payload.submittedAt)
    + row_('Source',       payload.source)
    + '</table>'
    + '</div></div>';

  MailApp.sendEmail({
    to:       NOTIFY_EMAIL,
    subject:  subject,
    body:     body,
    htmlBody: htmlBody,
  });
}

/** Helper to build a table row for the HTML email */
function row_(label, value) {
  return '<tr style="border-bottom:1px solid #f0e8d5;">'
    + '<td style="padding:10px 8px;font-weight:bold;color:#5C4A2A;width:120px;">' + label + '</td>'
    + '<td style="padding:10px 8px;color:#2C1D0A;">' + (value || '<em style="color:#aaa">—</em>') + '</td>'
    + '</tr>';
}
