import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permite acesso de qualquer IP na rede
    port: 5173, // Porta padrão do Vite
    strictPort: true, // Falha se a porta estiver em uso
    proxy: {
      // Proxy para o backend para evitar problemas de CORS em desenvolvimento
      "/api": {
        target: "http://localhost:8080", // URL do seu backend
        changeOrigin: true, // Necessário para virtual hosted sites
        secure: false, // Descomente se o backend não tiver HTTPS
      },
    },
    cors: true, // Habilita CORS no servidor de desenvolvimento Vite
    // allowedHosts: ['all'],
  },
  build: {
    outDir: "build", // Pasta de saída para produção
  },
});
