import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const file=path.join(root,'src/components/sections/section_1/projects.json');
const data=JSON.parse((await fs.readFile(file,'utf8')).replace(/^\uFEFF/,''));
const names=await fs.readdir(path.join(root,'public/assets'));
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const project of data.projects){
 if(project.autoImages===false)continue;
 const find=prefix=>{const re=new RegExp(`^${escape(prefix)}(\\d+)\\.(png|jpe?g|webp|avif|gif)$`,'i');return names.map(name=>({name,match:name.match(re)})).filter(x=>x.match).sort((a,b)=>Number(a.match[1])-Number(b.match[1])||a.name.localeCompare(b.name));};
 // Plain numbered files take precedence over the original reference detail files.
 const plain=find(`${project.slug}-`);
 const images=plain.length?plain:find(`${project.slug}-detail-`);
 if(!images.length)continue;
 const numbers=new Set();
 for(const image of images){const number=Number(image.match[1]);if(numbers.has(number))throw Error(`Duplicate image number for ${project.slug}: ${number}. Keep one format per number.`);numbers.add(number);}
 const old=project.blocks||[];
 const blocks=images.map(({name})=>{const src='/assets/'+name;return {...(old.find(b=>b.type==='image'&&b.src===src)||{}),type:'image',src,alt:project.title};});
 // Keep existing text/gallery blocks in place; append extra images at the last image slot.
 const last=old.findLastIndex(b=>b.type==='image');let index=0;const next=[];
 old.forEach((block,i)=>{if(block.type!=='image')next.push(block);else{if(index<blocks.length)next.push(blocks[index++]);if(i===last)next.push(...blocks.slice(index));}});
 if(last===-1)next.push(...blocks);
 project.blocks=next;
 console.log(`${project.title}: ${images.length} detail images`);
}
await fs.writeFile(file,JSON.stringify(data,null,2)+'\n');
