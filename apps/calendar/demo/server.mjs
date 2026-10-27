import http from "node:http";
import {readFile} from "node:fs/promises";
import {extract} from "./provider.mjs";
const files=new Map([["/",["index.html","text/html; charset=utf-8"]],["/intake.mjs",["ui.mjs","text/javascript; charset=utf-8"]],["/logic.mjs",["intake.mjs","text/javascript; charset=utf-8"]]]);
const server=http.createServer(async(req,res)=>{
 const origin=`http://127.0.0.1:${server.address().port}`;
 if(req.headers.host!==`127.0.0.1:${server.address().port}`){res.writeHead(403);res.end();return;}
 if(req.method==="POST" && req.url==="/extract"){
  if(req.headers.origin!==origin || req.headers["content-type"]!=="application/json"){res.writeHead(403);res.end();return;}
  try {let chunks=[],size=0; for await(const chunk of req){size+=chunk.length;if(size>7_100_000) throw new Error("Request too large.");chunks.push(chunk);} const body=JSON.parse(Buffer.concat(chunks).toString()); const events=await extract(body,process.env.OPENAI_API_KEY); res.writeHead(200,{"Content-Type":"application/json","Cache-Control":"no-store"});res.end(JSON.stringify({events}));} catch(e){res.writeHead(400,{"Content-Type":"application/json","Cache-Control":"no-store"});res.end(JSON.stringify({error:e.message}));} return;
 }
 const entry=files.get(req.url); if(req.method!=="GET" || !entry){res.writeHead(404);res.end();return;}
 try {const body=await readFile(new URL(entry[0],import.meta.url));res.writeHead(200,{"Content-Type":entry[1],"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'self'; style-src 'unsafe-inline'; object-src 'none'; base-uri 'none'; form-action 'none'"});res.end(body);}catch{res.writeHead(500);res.end();}
});
server.listen(0,"127.0.0.1",()=>console.log(`Local demo: http://127.0.0.1:${server.address().port}/`));
