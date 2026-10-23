import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import contactHandler from './api/contact'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'local-contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        void contactHandler(req, res).catch(() => {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(JSON.stringify({ success: false }));
        });
      });
    },
  }],
})
