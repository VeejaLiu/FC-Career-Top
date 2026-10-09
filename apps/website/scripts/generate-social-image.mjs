import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const scriptRequire = createRequire(import.meta.url);
const nextRequire = createRequire(scriptRequire.resolve('next/package.json'));
const sharp = nextRequire('sharp');

const publicDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public'
);
const logoSource = fs.readFileSync(
  path.join(publicDirectory, 'logo.svg'),
  'utf8'
);
const logo = logoSource
  .slice(logoSource.indexOf('<svg'))
  .replace(/width="[^"]+" height="[^"]+"/, 'width="96" height="96"');

const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#151616"/>
  <rect x="24" y="24" width="1152" height="582" rx="24" fill="#1e293b"/>
  <rect x="64" y="64" width="104" height="104" rx="52" fill="#94f17a"/>
  <g transform="translate(68 68)">${logo}</g>
  <g font-family="Arial, sans-serif" fill="white">
    <text x="192" y="133" font-size="64" font-weight="700">FC Career Top</text>
    <text x="64" y="270" font-size="58" font-weight="700">Track player growth</text>
    <text x="64" y="340" font-size="58" font-weight="700">in EA FC Career Mode</text>
    <text x="64" y="411" font-size="30" fill="#cbd5e1">EA FC 24 + FC 25 · Live Editor · Windows</text>
    <text x="64" y="496" font-size="27" fill="#94f17a">Free · Automatic · Open source</text>
    <text x="64" y="553" font-size="24" fill="#cbd5e1">www.fccareer.top</text>
  </g>
  <g stroke="#94f17a" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M900 535 L940 510 L980 515 L1020 467 L1060 449 L1110 380"/>
  </g>
</svg>`;

sharp(Buffer.from(artwork))
  .png()
  .toFile(path.join(publicDirectory, 'og-image.png'))
  .then(() => console.log('Created public/og-image.png (1200 × 630).'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
