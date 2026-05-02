import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = './public';

async function getFiles(dir) {
    const subdirs = await fs.readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await fs.stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

async function optimizeImages() {
    console.log('🚀 Iniciando optimización de imágenes...');
    
    try {
        const allFiles = await getFiles(PUBLIC_DIR);
        const images = allFiles.filter(file => /\.(avif|png|jpg|jpeg)$/i.test(file));

        console.log(`📸 Se encontraron ${images.length} imágenes para procesar.\n`);

        for (const file of images) {
            const relativePath = path.relative(process.cwd(), file);
            const stats = await fs.stat(file);
            const originalSize = (stats.size / 1024).toFixed(2);

            const buffer = await fs.readFile(file);
            let sharpInstance = sharp(buffer);

            const ext = path.extname(file).toLowerCase();
            
            // Configuración de compresión agresiva pero sin perder resolución
            if (ext === '.avif') {
                sharpInstance = sharpInstance.avif({ quality: 45, effort: 6 });
            } else if (ext === '.png') {
                sharpInstance = sharpInstance.png({ quality: 80, compressionLevel: 9 });
            } else if (ext === '.jpg' || ext === '.jpeg') {
                sharpInstance = sharpInstance.jpeg({ quality: 80, mozjpeg: true });
            }

            const optimizedBuffer = await sharpInstance.toBuffer();
            const optimizedSize = (optimizedBuffer.length / 1024).toFixed(2);

            if (optimizedBuffer.length < stats.size) {
                await fs.writeFile(file, optimizedBuffer);
                const saving = (originalSize - optimizedSize).toFixed(2);
                const percent = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1);
                console.log(`✅ ${path.basename(file)}: ${originalSize}KB -> ${optimizedSize}KB (-${percent}% | ${saving}KB ahorrados)`);
            } else {
                console.log(`ℹ️  ${path.basename(file)} ya está optimizada.`);
            }
        }

        console.log('\n✨ ¡Optimización completada con éxito!');
    } catch (error) {
        console.error('❌ Error durante la optimización:', error);
    }
}

optimizeImages();
