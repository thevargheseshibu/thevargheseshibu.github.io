import {chromium} from '@playwright/test';
const browser=await chromium.launch();const page=await browser.newPage();
console.log(await page.evaluate(()=>['video/webm;codecs=vp9','video/webm;codecs=vp8','video/mp4;codecs=avc1.42001E','video/mp4;codecs=av01.0.04M.08','video/mp4'].map(mime=>({mime,supported:MediaRecorder.isTypeSupported(mime)}))));await browser.close();
