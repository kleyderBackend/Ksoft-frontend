import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import handler from '../api/contact.ts';

const validBody = { name: '  Cliente de prueba  ', email: ' prueba@example.com ', message: ' Consulta de prueba ' };

async function invoke({ body = validBody, method = 'POST', contentType = 'application/json' } = {}) {
  const req = { method, headers: { 'content-type': contentType }, body };
  const headers = {};
  const res = { setHeader: (key, value) => { headers[key] = value; }, end: (value) => { res.body = JSON.parse(value); } };
  await handler(req, res);
  return { status: res.statusCode, body: res.body, headers };
}

test('rejects non-POST requests without contacting the delivery service', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not send'); });
  const result = await invoke({ method: 'GET' });
  assert.equal(result.status, 405);
  assert.equal(result.headers.Allow, 'POST');
  assert.equal(fetch.mock.callCount(), 0);
});

test('rejects invalid input and content types before sending', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not send'); });
  for (const body of [{ ...validBody, name: ' ' }, { ...validBody, email: 'invalid' }, { ...validBody, message: ' ' }, { ...validBody, message: 'x'.repeat(5001) }, '{', null]) {
    assert.equal((await invoke({ body })).status, 400);
  }
  assert.equal((await invoke({ contentType: 'text/plain' })).status, 415);
  assert.equal(fetch.mock.callCount(), 0);
});

test('confirms acknowledged delivery and trims the submitted fields', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('{"result":"success"}'));
  const result = await invoke();
  assert.deepEqual(result.body, { success: true });
  assert.equal(result.status, 200);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  const url = fetch.mock.calls[0].arguments[0];
  assert.equal(url.searchParams.get('name'), 'Cliente de prueba');
  assert.equal(url.searchParams.get('email'), 'prueba@example.com');
  assert.equal(url.searchParams.get('message'), 'Consulta de prueba');
});

test('accepts explicit acknowledgements used by Apps Script handlers', async (t) => {
  for (const text of ['OK', '{"success":true}', '{"status":"success"}']) {
    const mock = t.mock.method(globalThis, 'fetch', async () => new Response(text));
    assert.equal((await invoke()).status, 200);
    mock.mock.restore();
  }
});

test('never treats HTTP 200 HTML, unknown JSON, or an application error as delivery', async (t) => {
  for (const text of ['<html>Sign in required</html>', '{}', '{"result":"error"}', '{"success":false,"result":"success"}', '{"success":true,"error":"Delivery failed"}']) {
    const mock = t.mock.method(globalThis, 'fetch', async () => new Response(text));
    const result = await invoke();
    assert.equal(result.status, 502);
    assert.deepEqual(result.body, { success: false });
    mock.mock.restore();
  }
});

test('handles delivery service HTTP errors and network failures', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async () => new Response('Unavailable', { status: 503 }));
  assert.equal((await invoke()).status, 502);
  mock.mock.restore();
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Network timeout'); });
  assert.equal((await invoke()).status, 502);
});

test('reads a real JSON POST request and rejects oversized requests', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"success":true}'));
  const server = createServer((req, res) => { void handler(req, res); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { request } = await import('node:http');
  const post = (body) => new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: server.address().port, method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.end(body);
  });
  assert.equal(await post(JSON.stringify(validBody)), 200);
  assert.equal(await post(JSON.stringify({ ...validBody, message: 'x'.repeat(40000) })), 413);
});
