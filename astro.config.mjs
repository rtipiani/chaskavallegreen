// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    site: 'https://hotelchaskavallegreen.com/',
    output: 'server',
    adapter: vercel(),
    build: {
        inlineStylesheets: 'always'
    },
    vite: {
        // @ts-ignore
        plugins: [
            tailwindcss(),
            {
                name: 'font-display-swap',
                enforce: 'post',
                generateBundle(options, bundle) {
                    for (const fileName in bundle) {
                        if (fileName.endsWith('.css')) {
                            const chunk = bundle[fileName];
                            if (chunk.type === 'asset' && typeof chunk.source === 'string') {
                                chunk.source = chunk.source.replace(/font-display:\s*block/g, 'font-display: swap');
                            }
                        }
                    }
                }
            }
        ]
    },
    integrations: [sitemap()]
});
