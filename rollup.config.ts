import { camelCase } from 'lodash'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')

const libraryName = pkg.name

export default {
  input: `src/index.ts`,
  output: [
    {
      banner: '#!/usr/bin/env node',
      file: pkg.main,
      format: 'cjs',
      name: camelCase(libraryName),
      sourcemap: true
    }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['cheerio', 'fs-extra', 'path', 'yargs', 'chalk', 'figlet'],
  watch: {
    include: 'src/**'
  },
  plugins: [
    replace({
      '#!/usr/bin/env node': '',
      delimiters: ['', '']
    }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
}
