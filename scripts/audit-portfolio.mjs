import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
const measurements=[];
for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
 const page=await context.newPage();
 await page.addInitScript(()=>{
  window.__audit={cls:0,lcp:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries()){if(!e.hadRecentInput)window.__audit.cls+=e.value;}}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__audit.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
 });
 await page.goto('http://127.0.0.1:4173');await page.waitForTimeout(3000);
 measurements.push(await page.evaluate(width=>({viewport:width,...window.__audit,resources:performance.getEntriesByType('resource').length,transferBytes:performance.getEntriesByType('resource').reduce((a,x)=>a+x.transferSize,0),heroLoaded:document.querySelector('[data-portrait]').naturalWidth>0,overflow:document.documentElement.scrollWidth>innerWidth}),width));
 if(width===390){const scene=page.locator('#closeup');await scene.getByRole('button',{name:'03 System'}).click();await page.waitForTimeout(800);await page.screenshot({path:'artifacts/art-of-engineering/system-mobile-viewport.png'});await page.locator('.signature-controls').screenshot({path:'artifacts/art-of-engineering/chapters-mobile.png'});}
 await context.close();
}
await writeFile('artifacts/art-of-engineering/local-performance.json',JSON.stringify({note:'Local unthrottled Chromium sample; not Lighthouse or field Core Web Vitals.',measurements},null,2));
console.log(JSON.stringify(measurements));await browser.close();
