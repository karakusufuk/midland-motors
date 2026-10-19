import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const P='../midland-paket', SRC='../site-son-surum/public/assets/generated';
const cars=JSON.parse(fs.readFileSync('src/data/cars.json')).cars;
const need=new Set(); cars.forEach(c=>c.photos.forEach(p=>need.add(p)));
for(const p of need){ const m=p.match(/img\/cars\/([^/]+)\/(\d\d)\.webp/); const [_,dir,n]=m;
  const fix=`${P}/gorseller/cars-fix/${dir}/${n}.webp`; let src=fs.existsSync(fix)?fix:null;
  if(!src){ const f=fs.readdirSync(`${SRC}/${dir}`).find(x=>x.startsWith(n+'_')); src=`${SRC}/${dir}/${f}`; }
  fs.mkdirSync(`public/img/cars/${dir}`,{recursive:true});
  await sharp(src).resize({width:1280,withoutEnlargement:true}).webp({quality:78}).toFile(`public/img/cars/${dir}/${n}.webp`);
  await sharp(src).resize({width:960,withoutEnlargement:true}).webp({quality:76}).toFile(`public/img/cars/${dir}/${n}-960.webp`);
  await sharp(src).resize({width:640,withoutEnlargement:true}).webp({quality:74}).toFile(`public/img/cars/${dir}/${n}-640.webp`);
}
// car body
const body=sharp(`${P}/gorseller/CAR-BODY.png`).ensureAlpha(); const {data,info}=await body.raw().toBuffer({resolveWithObject:true});
for(let i=0;i<info.width*info.height;i++) if(data[i*4+3]<12) data[i*4+3]=0;
let b=sharp(data,{raw:{width:info.width,height:info.height,channels:4}});
const trimmed=await b.png().toBuffer(); const meta=await sharp(trimmed).trim({threshold:1}).toBuffer({resolveWithObject:true});
console.log('body trimmed',meta.info.width,meta.info.height,(meta.info.width/meta.info.height).toFixed(3));
await sharp(meta.data).resize({width:1400}).webp({quality:88,alphaQuality:100}).toFile('public/img/car-body.webp');
const w=await sharp(`${P}/gorseller/CAR-WHEEL.png`).trim({threshold:1}).toBuffer({resolveWithObject:true});
console.log('wheel',w.info.width,w.info.height);
await sharp(w.data).resize(420,420).webp({quality:88,alphaQuality:100}).toFile('public/img/car-wheel.webp');
await sharp(`${P}/gorseller/WORKSHOP.png`).resize({width:1200}).webp({quality:80}).toFile('public/img/workshop.webp');
