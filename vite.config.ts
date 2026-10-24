import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import contactHandler from './api/contact'
import teamHandler from './api/team'

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'');
  for(const key of ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','CONTACT_SCRIPT_URL']) if(env[key])process.env[key]=env[key];
  return {
  build: {rollupOptions:{output:{manualChunks:{supabase:['@supabase/supabase-js']}}}},
  plugins: [react(), {
    name: 'local-contact-api',
    configureServer(server) {
      server.middlewares.use('/api/team', (req,res) => { void teamHandler(req,res).catch(()=>{res.statusCode=500;res.end(JSON.stringify({error:'No se pudo completar la operación.'}));}); });
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
}})
