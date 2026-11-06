import { chromium } from '@playwright/test';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(2500);
await page.screenshot({path:'artifacts/art-of-engineering/hero-desktop.png'});
const scene=page.locator('#closeup');
for(const [label,name] of [['01 Perspective','perspective'],['02 Interface','interface'],['03 System','system'],['04 Experience','experience']]) {
 await scene.getByRole('button',{name:label}).click();await page.waitForTimeout(1800);await page.screenshot({path:'artifacts/art-of-engineering/'+name+'-desktop.png'});
 console.log(name,await scene.getAttribute('data-active'));
}
await page.setViewportSize({width:390,height:844});await page.reload();await page.waitForTimeout(2500);await page.screenshot({path:'artifacts/art-of-engineering/hero-mobile.png'});
await scene.getByRole('button',{name:'03 System'}).click();await page.waitForTimeout(600);await scene.screenshot({path:'artifacts/art-of-engineering/system-mobile.png'});
console.log(JSON.stringify({errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));
await browser.close();
