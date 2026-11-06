import { chromium } from '@playwright/test';
const browser=await chromium.launch();
for(const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4173');await page.waitForTimeout(800);
 await page.locator('#education').evaluate(el=>scrollTo(0,el.offsetTop-85));await page.waitForTimeout(300);
 await page.screenshot({path:'artifacts/art-of-engineering/education-'+width+'.png'});
 await page.locator('#education img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
 await page.locator('.site-nav').evaluate(el=>el.style.visibility='hidden');
 await page.locator('#education').screenshot({path:'artifacts/art-of-engineering/education-full-'+width+'.png'});
 await page.locator('.site-nav').evaluate(el=>el.style.visibility='');
 await page.locator('#experience').evaluate(el=>scrollTo(0,el.offsetTop-85));
 await page.screenshot({path:'artifacts/art-of-engineering/current-role-'+width+'.png'});
 console.log(JSON.stringify({width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),educationRecords:await page.locator('.education-record').count(),currentRoles:await page.locator('.experience-current').count()}));
 await page.close();
}
await browser.close();
