import assert from 'node:assert/strict';
import { test } from 'node:test';
import { slugify, safeImage, validateContent, parseAdminData } from '../src/Components/dashboards/adminModel.ts';
import { emptyWorkspace } from '../src/Components/dashboards/businessModel.ts';

const post = { id: '1', title: 'Novedad', slug: 'novedad', excerpt: '', content: '', image: '', status: 'draft', updatedAt: '2026-10-23T12:00:00.000Z' };
test('Spanish titles retain their words in content identifiers', () => {
  assert.equal(slugify('  Clínica: gestión y acompañamiento  '), 'clinica-gestion-y-acompanamiento');
});
test('drafts can be incomplete, ready content requires summary and body', () => {
  assert.equal(validateContent(post, []), '');
  assert.match(validateContent({...post, status: 'ready'}, []), /Completa el resumen/);
  assert.equal(validateContent({...post, status: 'ready', excerpt: 'Resumen', content: 'Texto'}, []), '');
});
test('duplicate identifiers are rejected without preventing updates', () => {
  assert.equal(validateContent(post, [post]), '');
  assert.match(validateContent({...post, id: '2'}, [post]), /Ya existe/);
});
test('preview images reject executable URLs and protocol-relative paths', () => {
  for (const value of ['javascript:alert(1)', '//example.com/a.png', '/\\example.com/a.png', 'data:text/html,test', 'http://example.com/a.png']) assert.equal(safeImage(value), false);
  for (const value of ['', '/img/logo.png', 'https://example.com/a.png']) assert.equal(safeImage(value), true);
});
test('saved content round-trips and malformed storage is rejected', () => {
  const data = {version: 1, posts: [post], products: [], activity: [], workspace: emptyWorkspace()};
  assert.deepEqual(parseAdminData(JSON.stringify(data)), data);
  for (const invalid of ['null', '{}', '{', JSON.stringify({...data, posts: [{...post, status: 'published'}]}), JSON.stringify({...data, posts: [post, post]})]) assert.throws(() => parseAdminData(invalid));
});
