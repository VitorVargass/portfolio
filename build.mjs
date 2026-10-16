import { mkdir, copyFile, cp, access, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {renderPortfolio} from './portfolio.mjs';

const file = (path) => fileURLToPath(new URL(path, import.meta.url));
await mkdir(file('./dist/'), { recursive: true });
const template = await readFile(file('./index.html'),'utf8');
await writeFile(file('./dist/index.html'),renderPortfolio(template));
await writeFile(file('./dist/en.html'),renderPortfolio(template,'en'));
await copyFile(file('./demo-3d.html'),file('./dist/demo-3d.html'));
await rm(file('./dist/styles.css'),{force:true});
let hasAssets = false;
try { await access(file('./assets/')); hasAssets = true; } catch {}
if (hasAssets) await cp(file('./assets/'), file('./dist/assets/'), { recursive: true });
await mkdir(file('./dist/assets/vendor/'), { recursive: true });
await Promise.all(['three.module.js', 'three.core.js'].map(name => copyFile(file('./node_modules/three/build/' + name), file('./dist/assets/vendor/' + name))));
await copyFile(file('./node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js'), file('./dist/assets/vendor/RoundedBoxGeometry.js'));
await copyFile(file('./node_modules/three/examples/jsm/utils/BufferGeometryUtils.js'), file('./dist/assets/vendor/BufferGeometryUtils.js'));
await copyFile(file('./node_modules/three/LICENSE'), file('./dist/assets/vendor/THREE-LICENSE.txt'));
console.log('Portfólio estático preparado em dist.');
