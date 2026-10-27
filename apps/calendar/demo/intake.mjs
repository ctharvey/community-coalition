// Synthetic extraction only. The upload is never sent to a service.
export const MAX_BYTES = 5 * 1024 * 1024;
export function validateUpload(name, type, bytes) {
  if (!bytes.length || bytes.length > MAX_BYTES) return "Choose a file up to 5 MB.";
  const checks = {
    "image/png": [".png", [137,80,78,71,13,10,26,10]],
    "image/jpeg": [".jpg", [255,216,255]],
    "application/pdf": [".pdf", [37,80,68,70,45]]
  };
  const rule = checks[type];
  const ext = name.toLowerCase();
  if (!rule || !(ext.endsWith(rule[0]) || (type === "image/jpeg" && ext.endsWith(".jpeg"))) || !rule[1].every((v,i) => bytes[i] === v)) return "Use a PNG, JPEG, or PDF with a matching file signature.";
  return "";
}
export function validateUrl(value) {
  if (!value.trim()) return true;
  try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; }
}
export async function validateIntake(url, file) {
  if (!validateUrl(url)) return "Source link must be an HTTPS URL without credentials.";
  const hasFile = Boolean(file && file.name);
  if (!url.trim() && !hasFile) return "Provide a source URL or a file.";
  if (hasFile) {
    if (file.size > MAX_BYTES) return "Choose a file up to 5 MB.";
    return validateUpload(file.name, file.type, new Uint8Array(await file.arrayBuffer()));
  }
  return "";
}
export function mockExtract(organization, sourceUrl) {
  return [{ title: "Synthetic community event", organization, date: "", startTime: "", endTime: "", timeZone: "America/Chicago", venue: "", admission: "", sourceUrl, unknown: "Date, times, venue, and admission must be checked against the flyer." }];
}
export function validateDraft(d) {
  const errors = [];
  if (!d.title.trim() || !d.organization.trim()) errors.push("Title and organization are required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date) || Number.isNaN(Date.parse(d.date + "T00:00:00Z")) || new Date(d.date + "T00:00:00Z").toISOString().slice(0,10) !== d.date) errors.push("Enter a valid date.");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(d.startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(d.endTime)) errors.push("Enter both start and end times.");
  else if (d.endTime <= d.startTime) errors.push("End time must be after start time on the same day.");
  try { new Intl.DateTimeFormat("en", {timeZone:d.timeZone}); } catch { errors.push("Enter a valid time zone."); }
  if (!d.timeZone.trim()) errors.push("Time zone is required.");
  if (!validateUrl(d.sourceUrl)) errors.push("Source link must be an HTTPS URL without credentials.");
  return errors;
}
