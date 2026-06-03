import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'apresentacao', 'screenshots');

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

// ── 1. Catalog map view (desktop) ──────────────────────────────────────
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto('http://3.239.205.29/catalogo', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  // dismiss cookie banner
  await page.evaluate(() => {
    const acc = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Aceitar'));
    if (acc) acc.click();
  });
  await new Promise(r => setTimeout(r, 400));
  // click the "Mapa" toggle button
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const mapa = btns.find(b => b.textContent.trim() === 'Mapa' || b.textContent.includes('Mapa'));
    if (mapa) mapa.click();
    else console.warn('Mapa btn not found, btns:', btns.map(b => b.textContent.trim()));
  });
  await new Promise(r => setTimeout(r, 5000)); // wait for leaflet
  await page.screenshot({ path: path.join(OUT, '05_catalog_map.png'), fullPage: false });
  console.log('✓ 05_catalog_map.png');
  await page.close();
}

// ── 2. Catalog map view (mobile) ───────────────────────────────────────
{
  const page = await browser.newPage();
  await page.emulate({
    viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
  });
  await page.goto('http://3.239.205.29/catalogo', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const acc = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Aceitar'));
    if (acc) acc.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const mapa = btns.find(b => b.textContent.trim() === 'Mapa' || b.textContent.includes('Mapa'));
    if (mapa) mapa.click();
  });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(OUT, '10m_catalog_map.png'), fullPage: false });
  console.log('✓ 10m_catalog_map.png');
  await page.close();
}

// ── 3. Logistics page (desktop) — just showing the filled form nicely ──
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto('http://3.239.205.29/logistica', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const acc = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Aceitar'));
    if (acc) acc.click();
  });
  await new Promise(r => setTimeout(r, 400));
  // Click origin input and type (Puppeteer keyboard approach)
  const originInput = await page.$('form .field-input');
  await originInput.click({ clickCount: 3 });
  await page.keyboard.type('Goiânia, GO');
  await page.keyboard.press('Tab');
  await page.keyboard.type('São Paulo, SP');
  await page.keyboard.press('Tab');
  await new Promise(r => setTimeout(r, 300));
  // Click submit button
  const submitBtn = await page.$('form button[type="submit"]');
  if (submitBtn) await submitBtn.click();
  else {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Calcular'));
      if (btn) btn.click();
    });
  }
  await new Promise(r => setTimeout(r, 7000));
  await page.screenshot({ path: path.join(OUT, '05_logistics_map.png'), fullPage: false });
  console.log('✓ 05_logistics_map.png');
  await page.close();
}

await browser.close();
