#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files with specific line fixes needed
const fixes = {
  'src/collections/LruMap.js': [
    { line: 125, old: 'const count = 0;', new: 'let count = 0;' },
  ],
  'src/collections/LruSet.js': [
    { line: 109, old: 'const count = 0;', new: 'let count = 0;' },
  ],
  'src/collections/Map.js': [
    { line: 140, old: 'const count = 0;', new: 'let count = 0;' },
  ],
  'src/collections/Set.js': [
    { line: 112, old: 'const count = 0;', new: 'let count = 0;' },
  ],
  'src/sources/ImageUrl.js': [
    { line: 35, old: 'const len = this._levels.length;', new: 'let len = this._levels.length;' },
  ],
  'src/geometries/Cube.js': [
    { line: 59, pattern: /for \(const i = 0; i < faceList\.length; i\+\+\)/, replace: 'for (let i = 0; i < faceList.length; i++)' },
    { line: 133, pattern: /for \(const p = 0; p < 4; p\+\+\)/, replace: 'for (let p = 0; p < 4; p++)' },
    { line: 172, pattern: /for \(const i = 0; i < 3; i\+\+\)/, replace: 'for (let i = 0; i < 3; i++)' },
    { line: 367, old: 'const count = 0;', new: 'let count = 0;' },
    { line: 402, pattern: /for \(const i = 0; i < 24; i\+\+\)/, replace: 'for (let i = 0; i < 24; i++)' },
  ],
  'src/TextureStore.js': [
    { line: 23, old: 'const nextId = 0;', new: 'let nextId = 0;' },
    { line: 100, pattern: /for \(const i = 0; i < tiles\.length; i\+\+\)/, replace: 'for (let i = 0; i < tiles.length; i++)' },
  ],
  'src/controls/Composer.js': [
    { line: 33, pattern: /\(opts\)/, replace: '(_opts)' },
    { line: 102, pattern: /if \(key == 'enabled'\)/, replace: "if (key === 'enabled')" },
  ],
  'src/geometries/Flat.js': [
    { line: 78, old: 'const scale = 1 / 2;', new: 'let scale = 1 / 2;' },
    { line: 85, pattern: /for \(const i = 1; i < this\._geometry\.levelList\.length; i\+\+\)/, replace: 'for (let i = 1; i < this._geometry.levelList.length; i++)' },
    { line: 142, pattern: /for \(const i = 0; i < neighborOffsets\.length; i\+\+\)/, replace: 'for (let i = 0; i < neighborOffsets.length; i++)' },
  ],
  'src/stages/Stage.js': [
    { line: 104, pattern: /function validate\(layer, rect\)/, replace: 'function validate(_layer, _rect)' },
  ],
  'src/Timer.js': [
    { line: 34, pattern: /for \(const i = 0; i < self\._list\.length; i\+\+\)/, replace: 'for (let i = 0; i < self._list.length; i++)' },
  ],
  'src/views/Rectilinear.js': [
    { line: 59, pattern: /for \(const j = 0; j < 4; j\+\+\)/, replace: 'for (let j = 0; j < 4; j++)' },
    { line: 125, pattern: /for \(const i = 0; i < 3; i\+\+\)/, replace: 'for (let i = 0; i < 3; i++)' },
    { line: 130, pattern: /function limit\(layer, rect\)/, replace: 'function limit(_layer, _rect)' },
    { line: 197, old: 'const h = (Math.PI * params.fov) / 180;', new: 'let h = (Math.PI * params.fov) / 180;' },
    { line: 198, old: 'const v = VerticalFov.htov(h, width, height);', new: 'let v = VerticalFov.htov(h, width, height);' },
    { line: 268, old: 'var transform = Matrix.create();', new: 'const transform = Matrix.create();' },
    { line: 466, pattern: /for \(const f = 0; f < 4; f\+\+\)/, replace: 'for (let f = 0; f < 4; f++)' },
    { line: 468, pattern: /for \(const x = 0; x <= numX; x\+\+\)/, replace: 'for (let x = 0; x <= numX; x++)' },
    { line: 469, pattern: /for \(const y = 0; y <= numY; y\+\+\)/, replace: 'for (let y = 0; y <= numY; y++)' },
  ],
};

let totalFixed = 0;

for (const [filePath, fileFixes] of Object.entries(fixes)) {
  const fullPath = path.join(__dirname, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  let modified = false;

  for (const fix of fileFixes) {
    const lineIndex = fix.line - 1;
    if (lineIndex < 0 || lineIndex >= lines.length) continue;

    const originalLine = lines[lineIndex];

    if (fix.pattern) {
      if (fix.pattern.test(originalLine)) {
        lines[lineIndex] = originalLine.replace(fix.pattern, fix.replace);
        modified = true;
        totalFixed++;
        console.log(`✓ ${filePath}:${fix.line}`);
      }
    } else if (fix.old) {
      if (originalLine.includes(fix.old)) {
        lines[lineIndex] = originalLine.replace(fix.old, fix.new);
        modified = true;
        totalFixed++;
        console.log(`✓ ${filePath}:${fix.line}`);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, lines.join('\n'));
  }
}

console.log(`\n✅ Fixed ${totalFixed} ESLint errors`);
