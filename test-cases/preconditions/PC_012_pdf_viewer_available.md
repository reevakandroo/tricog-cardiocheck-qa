---
id: PC_012
title: The browser can open and download PDF files
---

## Description
The test browser is configured to handle PDF files — either rendering them inline using the built-in PDF viewer or downloading them to disk — without prompting for an external application or blocking the download. This precondition is required for all test cases that validate ECG report generation, PDF export, and PDF content correctness.

## Setup Steps

### For Manual Testing
1. Confirm PC_001 is met.
2. Verify the Chromium built-in PDF viewer is enabled:
   - Navigate to `chrome://settings/content/pdfDocuments`.
   - Ensure the setting is **not** set to "Download PDFs" (or if it is, confirm the download folder is accessible and monitored).
3. Alternatively, confirm a PDF download destination folder is set:
   - Navigate to `chrome://settings/downloads`.
   - Note the download path (e.g., `~/Downloads`).
4. Test PDF rendering by opening a sample PDF (e.g., `https://www.w3.org/WAI/WCAG21/wcag21.pdf`) and confirming it renders in the browser or downloads successfully.

### For Automated Testing (Playwright)
1. Configure the Playwright browser context to accept PDF downloads:
   ```js
   const context = await browser.newContext({
     acceptDownloads: true
   });
   ```
2. To capture a PDF download during a test:
   ```js
   const [download] = await Promise.all([
     page.waitForEvent('download'),
     page.locator('[data-testid="export-pdf-button"]').click()
   ]);
   const filePath = await download.path();
   // Validate the file exists and is a valid PDF
   const fs = require('fs');
   const buffer = fs.readFileSync(filePath);
   expect(buffer.slice(0, 4).toString()).toBe('%PDF');
   ```
3. Confirm the Playwright context does not have downloads blocked.

## Verification
- Manual: Opening a PDF URL displays the PDF in the browser tab OR triggers a download to the expected folder without an error dialog.
- Automated: `download.path()` returns a non-null path and the file starts with the `%PDF` magic bytes.
- File size is greater than 0 bytes.

## Teardown
- Delete downloaded PDF files from the downloads folder after each test to avoid disk clutter and accidental reuse:
  ```js
  await download.delete(); // Playwright built-in
  ```
- Reset browser PDF settings to their original state if they were changed during setup.

## Referenced By
- TC_Report_Export
- TC_HIPAA (PHI in exported PDFs)
