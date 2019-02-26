#!/usr/bin/env node
import * as yargs from 'yargs'
import { makeGHPageSPA } from './spa-github-pages-cli'

const parser = yargs
  .usage('Usage: $0 <command> [options]')
  .command(
    '$0',
    'This cli tool can make your site SPA friendly when hosting by github pages',
    {},
    makeGHPageSPA
  )
  .example('$0 -d /docs', 'make the website under /docs folder SPA friendly with github')
  .alias('d', 'docs')
  .string('d')
  .describe('d', "The folder's name that contains index.html")
  .alias('c', 'customDomain')
  .boolean('c')
  .describe('c', 'Set to true if you are using a custom domain')
  .default({ d: 'docs', c: false })
  .epilog('for more information, find our manual at http://example.com')
  .help()

export { parser }
