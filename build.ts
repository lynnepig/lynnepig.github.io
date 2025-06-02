import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { join } from 'node:path';
import { bundle } from 'lightningcss';

async function minifyCss() {
  const { code } = bundle({
    filename: 'src/styles/styles.css',
    minify: true
  });

  const outputDir = path.join('docs', 'styles');
  const outputPath = path.join('docs', 'styles', 'styles.css');

  try {
    await mkdir(outputDir, { recursive: true });
    await writeFile(outputPath, code);
    console.log(`Minified CSS written to ${outputPath}`);
  } catch (error) {
    console.error(`Error writing minified CSS: ${error}`);
  }
}

async function copyFiles(srcDir: string, destDir: string) {
  try {
    await mkdir(destDir, { recursive: true });
    const files = await readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const srcFile = join(srcDir, file.name);
        const destFile = join(destDir, file.name);
        await copyFile(srcFile, destFile);
        console.log(`Copied ${srcFile} to ${destFile}`);
      }
    }
  } catch (error) {
    console.error(`Error copying files: ${error}`);
  }
}

await rm('docs', { recursive: true, force: true });
await copyFiles('src', 'docs');
await copyFiles('src/assets', 'docs/assets');
await minifyCss();
