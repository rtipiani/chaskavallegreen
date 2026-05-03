// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://hotelchaskavallegreen.com/',
    build: {
        inlineStylesheets: 'always'
    },
    vite: {
        // @ts-ignore
        plugins: [tailwindcss()]
    },
    integrations: [sitemap()]
});
