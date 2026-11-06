import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage();
const data = await page.evaluate(async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 960; canvas.height = 540;
  const ctx = canvas.getContext('2d');
  const stream = canvas.captureStream(24);
  const recorder = new MediaRecorder(stream, { mimeType:'video/webm;codecs=vp9', videoBitsPerSecond:500000 });
  const chunks = [];
  recorder.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
  const done = new Promise(resolve => recorder.onstop = async () => {
    const buffer = await new Blob(chunks,{type:'video/webm'}).arrayBuffer();
    let binary=''; for(const x of new Uint8Array(buffer)) binary+=String.fromCharCode(x);
    resolve(btoa(binary));
  });
  const duration = 6000;
  const start = performance.now();
  const draw = now => {
    const phase = ((now-start)/duration)*Math.PI*2;
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,960,540);
    for(let i=0;i<5;i++){
      const x = 580+i*90+Math.sin(phase+i*.6)*50;
      const gradient = ctx.createLinearGradient(x-140,0,x+140,0);
      gradient.addColorStop(0,'rgba(0,0,0,0)');
      gradient.addColorStop(.5,'rgba(190,166,111,'+(0.11+i*.014)+')');
      gradient.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); ctx.transform(1,0,-.35,1,130,0); ctx.fillStyle=gradient; ctx.fillRect(x-140,0,280,540); ctx.restore();
    }
    for(let i=0;i<24;i++){
      const x = (i*127.3)%960+Math.sin(phase+i)*9;
      const y = (i*71.8)%540+Math.cos(phase+i*.4)*10;
      ctx.fillStyle='rgba(212,196,157,'+(.12+Math.sin(phase+i)*.06)+')';
      ctx.beginPath();ctx.arc(x,y,.6+(i%3)*.3,0,Math.PI*2);ctx.fill();
    }
    if(now-start<duration) requestAnimationFrame(draw); else recorder.stop();
  };
  draw(start); recorder.start(); requestAnimationFrame(draw);
  return done;
});
await mkdir('public/media',{recursive:true});
await writeFile('public/media/atelier-light.webm',Buffer.from(data,'base64'));
await browser.close();
console.log('Saved decorative atelier light film.');
