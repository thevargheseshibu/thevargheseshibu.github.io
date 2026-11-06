import {readFile,writeFile,stat} from "node:fs/promises";
import {withWebmDuration} from "./webm-metadata.mjs";
const path="artifacts/cinematic-assets/manifest.json";
const manifest=JSON.parse(await readFile(path,"utf8"));
for(const asset of manifest.assets){
 const target="public/media/cinematic/"+asset.name+".webm";
 await writeFile(target,withWebmDuration(await readFile(target),asset.seconds*1000));
 asset.videos.find(v=>v.format==="webm").bytes=(await stat(target)).size;
}
await writeFile(path,JSON.stringify(manifest,null,2));
console.log("WebM duration metadata updated.");
