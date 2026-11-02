import test from "node:test";
import assert from "node:assert/strict";
import {extract, chicagoDate, resolveEventDate} from "../demo/provider.mjs";
const input={organization:"Example Org",sourceUrl:"https://example.org/post",text:"Synthetic fair November 7",file:null};
const event={title:"Fair",description:"Games and crafts",organization:"",date:"2026-11-07",startTime:"",endTime:"",timeZone:"",venue:"",admission:"",unknown:"Time unknown",monthDay:"11-07",weekday:"",yearSpecified:true};
test("sends synthetic content with standard processing and structured schema and preserves provenance",async()=>{
 const fetcher=async(url,options)=>{const request=JSON.parse(options.body);assert.equal(url,"https://api.openai.com/v1/responses");assert.equal(request.service_tier,"default");assert.equal(request.model,"gpt-6-luna");assert.equal(request.store,false);assert.equal(request.text.format.strict,true);assert.ok(request.text.format.schema.properties.events.items.required.includes("description")); assert.match(request.instructions,/activities/);return {ok:true,json:async()=>({status:"completed",service_tier:"default",output:[{content:[{type:"output_text",text:JSON.stringify({events:[event]})}]}]})};};
 const result=await extract(input,"test-key",fetcher);assert.equal(result[0].organization,"Example Org");assert.equal(result[0].sourceUrl,input.sourceUrl);assert.equal(result[0].date,"2026-11-07");assert.equal(result[0].description,"Games and crafts");
});
test("rejects URL-only extraction, failed tier, and malformed output",async()=>{
 await assert.rejects(()=>extract({...input,text:""},"key"),/cannot be read/);
 await assert.rejects(()=>extract(input,"key",async()=>({ok:true,json:async()=>({status:"completed",service_tier:"flex"})})),/processing mode/);
 await assert.rejects(()=>extract(input,"key",async()=>({ok:true,json:async()=>({status:"completed",service_tier:"default",output:[{content:[{type:"output_text",text:"{}"}]}]})})),/invalid event/);
});

test("passes a direct image link to OpenAI without requiring attribution",async()=>{
 const result=await extract({...input,sourceUrl:"",text:"",imageUrl:"https://example.org/flyer.png"},"key",async(url, options)=>{
  const request=JSON.parse(options.body); assert.deepEqual(request.input[0].content,[{type:"input_image",image_url:"https://example.org/flyer.png"}]);
  return {ok:true,json:async()=>({status:"completed",service_tier:"default",output:[{content:[{type:"output_text",text:JSON.stringify({events:[event]})}]}]})};
 });
 assert.equal(result[0].sourceUrl,"");
 await assert.rejects(()=>extract({...input,imageUrl:"https://127.0.0.1/a.png"},"key"),/Image link/);
});

test("yearless weekday dates choose next matching day and flag the assumption",()=>{
 const today="2026-10-26";
 const base={date:"",monthDay:"10-29",weekday:"Friday",yearSpecified:false,unknown:""};
 const found=resolveEventDate(base,today);
 assert.equal(found.date,"2027-10-29"); assert.match(found.unknown,/assumed.*confirm/);
 assert.equal(resolveEventDate({...base,weekday:""},today).date,"2026-10-29");
 assert.equal(resolveEventDate({...base,monthDay:"01-01",weekday:""},today).date,"2027-01-01");
 assert.equal(resolveEventDate({...base,monthDay:"02-29",weekday:""},today).date,"2028-02-29");
 assert.equal(resolveEventDate({...base,monthDay:"02-30"},today).date,"");
 const explicit=resolveEventDate({...base,date:"2021-10-29",yearSpecified:true},today); assert.equal(explicit.date,"2021-10-29"); assert.equal(explicit.unknown,"");
 const conflict=resolveEventDate({...base,date:"2026-10-29",yearSpecified:true},today); assert.equal(conflict.date,"2026-10-29"); assert.match(conflict.unknown,/conflicts/);
});
test("date reference respects Chicago calendar day",()=>{assert.equal(chicagoDate(new Date("2027-01-01T03:00:00Z")),"2026-12-31");});

test("Flex is an explicit option and unsupported tiers are rejected",async()=>{
 await extract({...input,processingMode:"flex"},"key",async(url,options)=>{const req=JSON.parse(options.body);assert.equal(req.service_tier,"flex");return {ok:true,json:async()=>({status:"completed",service_tier:"flex",output:[{content:[{type:"output_text",text:JSON.stringify({events:[event]})}]}]})};});
 await assert.rejects(()=>extract({...input,processingMode:"priority"},"key"),/Unsupported processing/);
});
