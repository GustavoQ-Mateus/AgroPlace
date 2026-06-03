import puppeteer from 'puppeteer';
import path from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://3.239.205.29';
const OUT = path.join(__dirname, 'apresentacao', 'screenshots');
mkdirSync(OUT, { recursive: true });

const LISTING_ID = 'f94fb31c-8ce4-4727-9b6a-50f5a34975fa';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
});

async function shot(name, url, opts = {}) {
  const { width = 1440, height = 900, mobile = false, wait = 2000, scrollY = 0 } = opts;
  const page = await browser.newPage();
  if (mobile) {
    await page.emulate({
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    });
  } else {
    await page.setViewport({ width, height, deviceScaleFactor: 1.5 });
  }
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }));
  if (scrollY) await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await new Promise(r => setTimeout(r, wait));
  // dismiss cookie banner if present
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const acc = btns.find(b => b.textContent.includes('Aceitar') || b.textContent.includes('Accept'));
    if (acc) acc.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  await page.close();
  console.log(`✓ ${name}`);
}

// Desktop
await shot('01_landing', BASE, { wait: 2500 });
await shot('02_catalog', `${BASE}/catalogo`, { wait: 2500 });
await shot('03_listing', `${BASE}/anuncio/${LISTING_ID}`, { wait: 2500 });
await shot('04_auth_login', `${BASE}/auth`, { wait: 1500 });
await shot('05_logistics_map', `${BASE}/logistica`, { wait: 5000 }); // wait for leaflet map

// Mobile
await shot('06m_landing', BASE, { mobile: true, wait: 2500 });
await shot('07m_catalog', `${BASE}/catalogo`, { mobile: true, wait: 2500 });
await shot('08m_listing', `${BASE}/anuncio/${LISTING_ID}`, { mobile: true, wait: 2500 });
await shot('09m_auth', `${BASE}/auth`, { mobile: true, wait: 1500 });
await shot('10m_logistics', `${BASE}/logistica`, { mobile: true, wait: 5000 });

await browser.close();
console.log('\nAll done →', OUT);
