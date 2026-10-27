import http from "node:http";
import {readFile} from "node:fs/promises";
const files = new Map([["/", ["index.html", "text/html; charset=utf-8"]], ["/intake.mjs", ["ui.mjs", "text/javascript; charset=utf-8"]], ["/logic.mjs", ["intake.mjs", "text/javascript; charset=utf-8"]]]);
const server=http.createServer(async (req,res)=>{ const entry=files.get(req.url); if(req.method!=="GET" || !entry){res.writeHead(404);res.end();return;} try {const body=await readFile(new URL(entry[0],import.meta.url)); res.writeHead(200,{"Content-Type":entry[1],"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'self'; style-src 'unsafe-inline'; object-src 'none'; base-uri 'none'; form-action 'none'"});res.end(body);}catch{res.writeHead(500);res.end();}});
server.listen(0,"127.0.0.1",()=>console.log(`Local demo: http://127.0.0.1:${server.address().port}/`));
