const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const fileUrl = 'file:///' + path.join(__dirname, '..', 'relatorio.html').split(path.sep).join('/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.pdf({
    path: path.join(__dirname, '..', 'relatorio.pdf'),
    format: 'A4',
    printBackground: true,
  });
  await browser.close();
  console.log('relatorio.pdf gerado');
})();
