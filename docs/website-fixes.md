# Correcciones de la web

## Comprobación local

- `npm run dev`: web y `/api/contact` en el mismo servidor.
- `npm run build`: comprueba TypeScript, incluida la función de contacto, y genera `dist`.
- `npm run lint`: análisis estático.
- `npm test`: prueba validación, confirmaciones reales frente a respuestas de error, fallos de red y peticiones HTTP con el servicio externo simulado. No envía mensajes a Google.

## Publicación en Vercel

Publicar el proyecto completo, incluida la carpeta `api` y `vercel.json`. Subir únicamente `dist` no incluye la función de contacto. Las rutas de la web se reescriben a `index.html`; `/api/` queda reservado para funciones.

Se mantiene el Apps Script que ya estaba configurado. Opcionalmente se puede cambiar con `CONTACT_SCRIPT_URL` en el servidor, sin prefijo `VITE_`.

El script debe confirmar **después de guardar o enviar** con JSON `{"success":true}`, `{"result":"success"}` o `{"status":"success"}`, o texto `OK`/`success`. Una página HTML, un estado HTTP de error o una respuesta no reconocida produce un aviso y conserva el mensaje en el formulario. Confirmar el contrato del Apps Script y la recepción real después del despliegue: las pruebas locales no demuestran la entrega del proveedor.

La integración existente usa `doGet`; sus parámetros se envían desde el servidor al script, ya no desde el navegador. No registrar estas URLs, porque contienen el mensaje y los datos de contacto. Una futura modificación coordinada del Apps Script puede migrarlo a `doPost`.

El correo público se centraliza en `src/config/contact.ts` usando el que ya mostraba la página de Contacto. El panel privado, CRM, portafolio y cifras comerciales no se modifican en esta etapa.
