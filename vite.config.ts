import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('certificate/localhost.key'),
      cert: fs.readFileSync('certificate/localhost.crt'),
    }
  }
});