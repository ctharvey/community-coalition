import {lookup} from 'node:dns/promises';
import https from 'node:https';
import {mkdir, writeFile, rm} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {validateImageUrl, validateUpload, MAX_BYTES} from './intake.mjs';

export function publicIpv4(address) {
  const p = address.split('.').map(Number);
  if (p.length !== 4 || p.some(x => !Number.isInteger(x) || x < 0 || x > 255)) return false;
  const [a,b,c] = p;
  return !(a===0 || a===10 || a===127 || a>=224 || a===169 && b===254 || a===172 && b>=16 && b<=31 || a===192 && (b===168 || b===0 || b===2 || b===88 && c===99) || a===100 && b>=64 && b<=127 || a===198 && (b===18 || b===19 || b===51 && c===100) || a===203 && b===0 && c===113);
}

export async function downloadImage(url) {
  if (!url || !validateImageUrl(url)) throw new Error('Enter a public HTTPS image link.');
  const parsed = new URL(url);
  let addresses;
  try { addresses = await lookup(parsed.hostname, {all:true, verbatim:true}); }
  catch { throw new Error('Image host could not be resolved.'); }
  const ipv4 = addresses.filter(a => a.family === 4);
  if (!ipv4.length || ipv4.some(a => !publicIpv4(a.address))) throw new Error('Image host must resolve to public IPv4 addresses.');
  return new Promise((resolve, reject) => {
    const request = https.get(parsed, {family:4, lookup:(_host,_options,cb)=>cb(null,ipv4[0].address,4), timeout:15000, headers:{accept:'image/png,image/jpeg'}}, res => {
      if (res.statusCode !== 200) { res.resume(); reject(new Error('Image link must return an image directly; redirects are not followed.')); return; }
      const type = (res.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      const ext = type === 'image/png' ? 'png' : type === 'image/jpeg' ? 'jpg' : null;
      if (!ext) { res.resume(); reject(new Error('Image link must return PNG or JPEG.')); return; }
      let size=0; const chunks=[];
      res.on('data', chunk => { size += chunk.length; if (size > MAX_BYTES) { request.destroy(new Error('Image too large')); return; } chunks.push(chunk); });
      res.on('error', () => reject(new Error('Image download failed.')));
      res.on('end', () => { const bytes=Buffer.concat(chunks), name=`image.${ext}`; const error=validateUpload(name,type,bytes); if (error) reject(new Error(error)); else resolve({name,type,data:bytes.toString('base64')}); });
    });
    request.on('timeout', () => request.destroy());
    request.on('error', () => reject(new Error('Image download failed or exceeded 5 MB.')));
  });
}

export async function saveReview(root, body, events) {
  const id=randomUUID();
  await mkdir(root, {recursive:true,mode:0o700});
  const dir=path.join(root,id); await mkdir(dir,{mode:0o700});
  try {
    let filename=null;
    if (body.file) {
      const f=body.file;
      if (typeof f.data !== 'string' || f.data.length > 7_000_000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(f.data)) throw new Error('Invalid file.');
      const bytes=Buffer.from(f.data,'base64'), error=validateUpload(f.name,f.type,bytes);
      if (error) throw new Error(error);
      filename=f.type==='application/pdf'?'original.pdf':f.type==='image/png'?'original.png':'original.jpg';
      await writeFile(path.join(dir,filename),bytes,{mode:0o600,flag:'wx'});
    }
    const record={createdAt:new Date().toISOString(),status:'extracted_for_review',organization:body.organization,sourceUrl:body.sourceUrl,imageUrl:body.imageUrl || '',originalFile:filename,events};
    await writeFile(path.join(dir,'extraction.json'),JSON.stringify(record,null,2)+'\n',{mode:0o600,flag:'wx'});
    return id;
  } catch (error) { await rm(dir,{recursive:true,force:true}); throw error; }
}
