const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
  const fileUrl = 'file:///' + path.join(__dirname, '..', 'relatorio.html').split(path.sep).join('/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  const box = await page.evaluate(() => document.body.scrollHeight);
  console.log('altura total (px):', box);

  const slice = 1400;
  let y = 0;
  let i = 1;
  while (y < box) {
    await page.screenshot({
      path: path.join(__dirname, '..', 'screenshots', `_preview_relatorio_${String(i).padStart(2, '0')}.png`),
      fullPage: true,
      clip: { x: 0, y, width: 700, height: Math.min(slice, box - y) },
    });
    y += slice;
    i++;
  }
  await browser.close();
  console.log('slices:', i - 1);
})();
