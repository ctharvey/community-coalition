import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

test('demo serves only its local assets and accepts no uploads or draft requests', async (t) => {
  const server = spawn(process.execPath, ['demo/server.mjs'], {stdio:['ignore','pipe','pipe']});
  t.after(() => server.kill());
  const [chunk] = await once(server.stdout, 'data');
  const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];
  assert.ok(url);
  const home = await fetch(url);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Synthetic demonstration only/);
  assert.equal((await fetch(new URL('drafts', url))).status, 404);
  assert.equal((await fetch(url, {method:'POST', body:'private upload'})).status, 404);
  assert.equal((await fetch(new URL('logic.mjs', url))).status, 200);
  assert.equal((await fetch(new URL('extract', url), {method:'POST',headers:{'Origin':'https://example.org','Content-Type':'application/json'},body:'{}'})).status, 403);
  assert.equal((await fetch(new URL('extract', url), {method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status, 403);
});
