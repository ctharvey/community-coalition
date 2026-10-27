import test from "node:test";
import assert from "node:assert/strict";
import {extract} from "../demo/provider.mjs";
const input={organization:"Example Org",sourceUrl:"https://example.org/post",text:"Synthetic fair November 7",file:null};
const event={title:"Fair",organization:"",date:"2026-11-07",startTime:"",endTime:"",timeZone:"",venue:"",admission:"",unknown:"Time unknown"};
test("sends synthetic content with Flex and structured schema and preserves provenance",async()=>{
 const fetcher=async(url,options)=>{const request=JSON.parse(options.body);assert.equal(url,"https://api.openai.com/v1/responses");assert.equal(request.service_tier,"flex");assert.equal(request.store,false);assert.equal(request.text.format.strict,true);return {ok:true,json:async()=>({status:"completed",service_tier:"flex",output:[{content:[{type:"output_text",text:JSON.stringify({events:[event]})}]}]})};};
 const result=await extract(input,"test-key",fetcher);assert.equal(result[0].organization,"Example Org");assert.equal(result[0].sourceUrl,input.sourceUrl);assert.equal(result[0].date,"2026-11-07");
});
test("rejects URL-only extraction, failed tier, and malformed output",async()=>{
 await assert.rejects(()=>extract({...input,text:""},"key"),/cannot be read/);
 await assert.rejects(()=>extract(input,"key",async()=>({ok:true,json:async()=>({status:"completed",service_tier:"default"})})),/Flex/);
 await assert.rejects(()=>extract(input,"key",async()=>({ok:true,json:async()=>({status:"completed",service_tier:"flex",output:[{content:[{type:"output_text",text:"{}"}]}]})})),/invalid event/);
});
