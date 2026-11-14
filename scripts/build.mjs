import {mkdir,copyFile,cp,readFile} from 'node:fs/promises';
await mkdir('dist/backend',{recursive:true});
await cp('site','dist',{recursive:true});
await copyFile('backend/domain.mjs','dist/backend/domain.mjs');
const html=await readFile('dist/index.html','utf8');
if(!html.includes('src="./web/app.mjs"'))throw new Error('Relative base path missing');
console.log('Built dist; relative base /Encontro-Marcado/ supported.');
