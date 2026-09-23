import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';

const base=process.env.PAGES_BASE || '/';
export default defineConfig({
  base,
  plugins:[react(),{
    name:'public-json-base',
    async closeBundle(){
      for(const name of ['loader.json','favicon-644e3b394fdf2ec9.bin']){
        const file=path.resolve('dist/assets',name);
        const json=await readFile(file,'utf8');
        await writeFile(file,json.replaceAll('"/assets/',`"${base}assets/`));
      }
    }
  }]
});
