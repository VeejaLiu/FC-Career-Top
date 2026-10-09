import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default async ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    server: { port: 3000 },
    plugins: [react()],
  });
};
