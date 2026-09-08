const { chromium } = require('playwright');
const path = require('path');

const pages = [
  '01-corridas.html',
  '02-cadastrar-corrida.html',
  '03-cadastrar-equipe.html',
  '04-registrar-passagem.html',
  '05-consultar-corrida.html',
  '06-historico-equipe.html',
];

const protoDir = path.join(__dirname, '..', 'prototipo');
const outDir = path.join(__dirname, '..', 'screenshots');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  for (const file of pages) {
    const fileUrl = 'file:///' + path.join(protoDir, file).replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    const outFile = path.join(outDir, file.replace('.html', '.png'));
    await page.screenshot({ path: outFile, fullPage: true });
    console.log('captured', outFile);
  }

  await browser.close();
})();
