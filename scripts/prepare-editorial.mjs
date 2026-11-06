import sharp from 'sharp';
const base = 'artifacts/portrait-review/assets/';
await sharp(base+'01-private-atelier.png').webp({quality:88}).toFile('public/images/editorial/atelier.webp');
await sharp(base+'01-private-atelier.png').extract({left:700,top:0,width:800,height:941}).resize(800,1200,{fit:'cover',position:'top'}).webp({quality:88}).toFile('public/images/editorial/atelier-mobile.webp');
await sharp(base+'02-the-architect.png').resize({width:1400}).webp({quality:86}).toFile('public/images/editorial/architect.webp');
await sharp(base+'03-after-hours.png').resize({width:1400}).webp({quality:85}).toFile('public/images/editorial/after-hours.webp');
await sharp(base+'01-private-atelier.png').resize(1200,630).jpeg({quality:88}).toFile('public/images/og.jpg');
