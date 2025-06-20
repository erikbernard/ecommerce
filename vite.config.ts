import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { config } from 'dotenv'

// https://vite.dev/config/
const env = config({ path: "./.env"}).parsed || {};
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: Number(env.PORT) || 3000, // Usa a porta definida nas variáveis de ambiente ou 3000 por padrão
    strictPort: true,
    host: true,
    origin: env.ORIGIN || "http://localhost:3000", // Usa o origin definido nas variáveis de ambiente ou localhost:3000 por padrão
  },
  // Configuração da visualização

  define: {
    "process.env.BASE_URL": JSON.stringify(env.BASE_URL),
  },
})
