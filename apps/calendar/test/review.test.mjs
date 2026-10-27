import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, readdir, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {publicIpv4, saveReview, downloadImage} from '../demo/review.mjs';

test('stores an original and extraction together and rejects invalid files', async t => {
  const root=await mkdtemp(path.join(tmpdir(),'calendar-review-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const bytes=Buffer.from([137,80,78,71,13,10,26,10]);
  const body={organization:'Example',sourceUrl:'',imageUrl:'https://example.org/image.png',file:{name:'flyer.png',type:'image/png',data:bytes.toString('base64')}};
  const events=[{title:'Synthetic event',date:'2026-11-07'}];
  const id=await saveReview(root,body,events);
  assert.deepEqual(await readFile(path.join(root,id,'original.png')),bytes);
  const record=JSON.parse(await readFile(path.join(root,id,'extraction.json'),'utf8'));
  assert.deepEqual(record.events,events); assert.equal(record.originalFile,'original.png');
  await assert.rejects(()=>saveReview(root,{...body,file:{...body.file,data:Buffer.from('wrong').toString('base64')}},events));
  assert.deepEqual(await readdir(root),[id]);
});

test('image download rejects local and special network addresses', async()=>{
  for (const ip of ['127.0.0.1','10.2.3.4','169.254.169.254','192.168.0.1','172.31.0.1','100.64.0.1','203.0.113.5']) assert.equal(publicIpv4(ip),false);
  assert.equal(publicIpv4('8.8.8.8'),true);
  await assert.rejects(()=>downloadImage('https://127.0.0.1/image.png'));
});
