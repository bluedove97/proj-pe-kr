import { execSync } from 'child_process';
import fs from 'fs';

const url  = process.argv[2] || 'http://localhost:3000';
const out  = process.argv[3] || 'screenshot.png';

// Use Puppeteer if available, otherwise fallback message
try {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log(`Screenshot saved: ${out}`);
} catch {
  console.log('Puppeteer not installed. Open http://localhost:3000 in a browser to preview.');
}
