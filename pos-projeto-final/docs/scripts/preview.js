const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const rel = process.argv[2];
const outName = process.argv[3];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });

  const srcPath = path.join(__dirname, '..', rel);
  let fileUrl;

  if (srcPath.endsWith('.svg')) {
    const svg = fs.readFileSync(srcPath, 'utf8');
    const tmpHtml = path.join(__dirname, '_tmp_preview.html');
    fs.writeFileSync(tmpHtml, '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;background:#fff;}</style></head><body>' + svg + '</body></html>');
    fileUrl = 'file:///' + tmpHtml.split(path.sep).join('/');
  } else {
    fileUrl = 'file:///' + srcPath.split(path.sep).join('/');
  }

  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshots', outName), fullPage: true });
  await browser.close();
  console.log('done', outName);
})();
