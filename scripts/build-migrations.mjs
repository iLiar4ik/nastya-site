import fs from 'fs'
import path from 'path'
import { build } from 'esbuild'

const dir = 'migrations'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'))
for (const f of files) {
  await build({
    entryPoints: [path.join(dir, f)],
    outfile: path.join(dir, f.replace('.ts', '.js')),
    platform: 'node',
    format: 'cjs',
    packages: 'external',
  })
}
