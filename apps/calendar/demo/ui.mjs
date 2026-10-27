import {validateIntake, mockExtract, validateDraft} from "/logic.mjs";
const intake = document.querySelector("#intake"), message = document.querySelector("#message"), drafts = document.querySelector("#drafts");
const fields = [["title","Title","text"],["organization","Organization","text"],["date","Date","date"],["startTime","Start time","time"],["endTime","End time","time"],["timeZone","Time zone","text"],["venue","Venue or address","text"],["admission","Admission or RSVP","text"],["sourceUrl","Original link","url"],["unknown","Unknown or ambiguous items","text"]];
function editor(draft) {
  const form = document.createElement("form"), heading = document.createElement("h2"); heading.textContent = "Review extracted draft"; form.append(heading);
  for (const [key, label, type] of fields) { const l=document.createElement("label"), input=document.createElement("input"); l.textContent=label; input.name=key; input.type=type; input.value=draft[key]; l.append(input); form.append(l); }
  const error=document.createElement("p"); error.className="error"; error.setAttribute("role","alert"); form.append(error);
  const confirm=document.createElement("button"); confirm.textContent="Confirm draft"; form.append(confirm);
  const split=document.createElement("button"); split.type="button"; split.textContent="Add another draft"; split.onclick=()=>editor(Object.fromEntries(new FormData(form))); form.append(split);
  form.oninput=()=>form.querySelector(".success")?.remove();
  form.onsubmit=e=>{e.preventDefault(); const d=Object.fromEntries(new FormData(form)); const errors=validateDraft(d); error.textContent=errors.join("\n"); if(errors.length) return; let preview=form.querySelector(".success"); if(!preview){ preview=document.createElement("div"); preview.className="success"; form.append(preview); } preview.replaceChildren(); const heading=document.createElement("strong"); heading.textContent="Confirmed locally; not submitted or published"; preview.append(heading); for(const [key,label] of fields){const line=document.createElement("p"); line.textContent=label+": "+(d[key] || "Not provided"); preview.append(line);} }; drafts.append(form);
}
intake.onsubmit=async e=>{
 e.preventDefault(); message.textContent=""; const data=new FormData(intake), file=data.get("file"), url=String(data.get("sourceUrl")).trim(), imageUrl=String(data.get("imageUrl")).trim(), text=String(data.get("text")); const error=await validateIntake(url,file,imageUrl,text); if(error){message.textContent=error;return;}
 let events;
 if(data.get("mode")==="mock") events=mockExtract(String(data.get("organization")),url);
 else { try { const payload={organization:String(data.get("organization")),sourceUrl:url,imageUrl,text,file:null}; if(file?.name){const raw=new Uint8Array(await file.arrayBuffer()); let binary=""; for(let i=0;i<raw.length;i+=32768) binary+=String.fromCharCode(...raw.subarray(i,i+32768)); payload.file={name:file.name,type:file.type,data:btoa(binary)};} message.textContent="Extracting with Flex; this may take several minutes."; const response=await fetch("/extract",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); const result=await response.json(); if(!response.ok) throw new Error(result.error); events=result.events; if(!events.length) throw new Error("No events were found; add clearer content or use mock mode."); message.textContent=""; } catch(err){message.textContent=err.message;return;} }
 drafts.replaceChildren(); for(const draft of events) editor(draft);
};
