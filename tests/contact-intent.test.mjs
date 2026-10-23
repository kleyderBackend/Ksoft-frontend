import assert from 'node:assert/strict';
import { test } from 'node:test';
import { products } from '../src/config/products.ts';
import { createContactMessage, getContactIntent } from '../src/utils/contactIntent.ts';

test('pilot links retain the correct product and intent after a reload', () => {
  for (const product of products) {
    const url = new URL(product.pilotHref, 'https://example.com');
    const intent = getContactIntent(url.search, products);
    assert.equal(intent.product?.slug, product.slug);
    assert.equal(intent.isPilot, true);
    assert.equal(url.hash, '#contact-form');
  }
});

test('unknown query values never become a product or pilot request', () => {
  for (const search of ['?producto=unknown&motivo=piloto', '?motivo=piloto', '?producto=<script>']) {
    assert.deepEqual(getContactIntent(search, products), { product: undefined, isPilot: false });
  }
  assert.equal(getContactIntent('?producto=ksoft-travel', products).isPilot, false);
});

test('a pilot request with no optional message still sends product and purpose', () => {
  const message = createContactMessage({ topic: 'Producto SaaS', productName: 'Ksoft Travel', isPilot: true, message: '' });
  assert.match(message, /Solicitud de participación en el piloto/);
  assert.match(message, /Producto: Ksoft Travel/);
  assert.match(message, /disponibilidad y las condiciones/);
});

test('optional business context is preserved and respects API message limits', () => {
  const message = createContactMessage({ topic: 'Producto SaaS', productName: 'SaaS Dental', isPilot: true, message: '  Mi consultorio  ' });
  assert.ok(message.endsWith('Mi consultorio'));
  const longest = createContactMessage({ topic: 'Producto SaaS', productName: 'Ksoft Travel', isPilot: true, message: 'a'.repeat(4700) });
  assert.ok(longest.length <= 5000);
  assert.equal(createContactMessage({ topic: 'Otra consulta', isPilot: false, message: 'Consulta general' }), 'Motivo: Otra consulta\n\nConsulta general');
});
