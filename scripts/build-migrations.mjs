import fs from 'fs'
import path from 'path'
import { build } from 'esbuild'

const dir = 'migrations'
if (!fs.existsSync(dir)) {
  process.exit(0)
}
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.startsWith('index'))
for (const f of files) {
  await build({
    entryPoints: [path.join(dir, f)],
    outfile: path.join(dir, f.replace('.ts', '.js')),
    platform: 'node',
    format: 'esm',
    packages: 'external',
  })
}
