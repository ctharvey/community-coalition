import test from "node:test";
import assert from "node:assert/strict";
import {validateUpload, validateUrl, mockExtract, validateDraft, MAX_BYTES} from "../demo/intake.mjs";
const png = Uint8Array.from([137,80,78,71,13,10,26,10]);
test("upload rejects unsupported, spoofed, empty and oversized files",()=>{
 assert.equal(validateUpload("flyer.png","image/png",png), "");
 assert.ok(validateUpload("flyer.pdf","application/pdf",png));
 assert.ok(validateUpload("flyer.svg","image/svg+xml",png));
 assert.ok(validateUpload("flyer.png","image/png",new Uint8Array()));
 assert.ok(validateUpload("flyer.png","image/png",new Uint8Array(MAX_BYTES+1)));
});
test("source links require credential-free HTTPS",()=>{assert.ok(validateUrl("https://www.facebook.com/events/123")); assert.ok(validateUrl("")); assert.equal(validateUrl("http://example.org"),false); assert.equal(validateUrl("https://u:p@example.org"),false);});
test("mock preserves provenance and requires corrected date and time",()=>{
 const d=mockExtract("Example org","https://example.org/post")[0]; assert.equal(d.organization,"Example org"); assert.equal(d.sourceUrl,"https://example.org/post"); assert.ok(validateDraft(d).length);
 Object.assign(d,{title:"Corrected title",date:"2026-11-07",startTime:"15:00",endTime:"17:00"}); assert.deepEqual(validateDraft(d),[]);
 d.date="2026-02-30"; assert.ok(validateDraft(d).length); d.date="2026-11-07"; d.endTime="14:00"; assert.ok(validateDraft(d).length);
});
