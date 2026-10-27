import {validateIntake, mockExtract, validateDraft} from "/logic.mjs";
const intake = document.querySelector("#intake"), message = document.querySelector("#message"), drafts = document.querySelector("#drafts");
const fields = [["title","Title","text"],["organization","Organization","text"],["date","Date","date"],["startTime","Start time","time"],["endTime","End time","time"],["timeZone","Time zone","text"],["venue","Venue or address","text"],["admission","Admission or RSVP","text"],["sourceUrl","Original link","url"],["unknown","Unknown or ambiguous items","text"]];
function editor(draft) {
  const form = document.createElement("form"), heading = document.createElement("h2"); heading.textContent = "Review mock draft"; form.append(heading);
  for (const [key, label, type] of fields) { const l=document.createElement("label"), input=document.createElement("input"); l.textContent=label; input.name=key; input.type=type; input.value=draft[key]; l.append(input); form.append(l); }
  const error=document.createElement("p"); error.className="error"; error.setAttribute("role","alert"); form.append(error);
  const confirm=document.createElement("button"); confirm.textContent="Confirm draft"; form.append(confirm);
  const split=document.createElement("button"); split.type="button"; split.textContent="Add another draft"; split.onclick=()=>editor(Object.fromEntries(new FormData(form))); form.append(split);
  form.oninput=()=>form.querySelector(".success")?.remove();
  form.onsubmit=e=>{e.preventDefault(); const d=Object.fromEntries(new FormData(form)); const errors=validateDraft(d); error.textContent=errors.join("\n"); if(errors.length) return; let preview=form.querySelector(".success"); if(!preview){ preview=document.createElement("div"); preview.className="success"; form.append(preview); } preview.replaceChildren(); const heading=document.createElement("strong"); heading.textContent="Confirmed locally; not submitted or published"; preview.append(heading); for(const [key,label] of fields){const line=document.createElement("p"); line.textContent=label+": "+(d[key] || "Not provided"); preview.append(line);} }; drafts.append(form);
}
intake.onsubmit=async e=>{e.preventDefault(); message.textContent=""; const data=new FormData(intake), file=data.get("file"), url=String(data.get("sourceUrl")).trim(); const error=await validateIntake(url,file); if(error){message.textContent=error;return;} drafts.replaceChildren(); for(const draft of mockExtract(String(data.get("organization")),url)) editor(draft); };
