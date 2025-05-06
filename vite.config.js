import { defineConfig } from 'vite'
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
    plugins: [
        dsv(),
],
root: '.', // Spécifie le dossier racine
    publicDir: 'public', // Dossier des assets publics
    build: {
        outDir: 'dist'
    },
css: './postcss.config.cjs',
})