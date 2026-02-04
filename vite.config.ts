
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Faz com que o site funcione em qualquer URL (importante para GitHub Pages)
});
