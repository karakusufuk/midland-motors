// Covers readable number plates with a flat #1E2124 rectangle. Boxes are in a 480x480 frame (photos are square).
import sharp from 'sharp'; import fs from 'fs';
const B = { 'hyundai-i30/01':[338,273,415,299], 'hyundai-i30/02':[57,262,155,299], 'peugeot-208/01':[337,272,431,304],
  'peugeot-3008/01':[301,281,401,311], 'peugeot-3008/02':[75,209,177,247] };
for (const [k,[x0,y0,x1,y1]] of Object.entries(B)) for (const suf of ['','-640']) {
  const f = `public/img/cars/${k}${suf}.webp`; const m = await sharp(f).metadata(); const sx = m.width/480, sy = m.height/480;
  const w = Math.round((x1-x0)*sx), h = Math.round((y1-y0)*sy);
  const buf = await sharp({create:{width:w,height:h,channels:3,background:'#1E2124'}}).png().toBuffer();
  const out = await sharp(f).composite([{input:buf,left:Math.round(x0*sx),top:Math.round(y0*sy)}]).webp({quality:78}).toBuffer();
  fs.writeFileSync(f,out);
}
console.log('plates covered');
