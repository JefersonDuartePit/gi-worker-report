import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLE_FILE=true npm run build:single -> gera dist/index.html único,
// com todo JS/CSS/imagens embutidos (base64). Ver docs/DEPLOY.md.
const isSingleFile = process.env.SINGLE_FILE === 'true'

export default defineConfig({
  plugins: [react(), ...(isSingleFile ? [viteSingleFile()] : [])],
})
