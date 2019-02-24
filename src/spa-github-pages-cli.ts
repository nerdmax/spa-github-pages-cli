#!/usr/bin/env node
import chalk from 'chalk'
import * as cheerio from 'cheerio'
import * as figlet from 'figlet'
import * as fs from 'fs-extra'
import * as path from 'path'

type Args = { [x: string]: string | boolean }

type Config = { isCustomDomain: boolean }

const logProjectName = () => {
  console.log(
    chalk.green(
      figlet.textSync('spa-github-pages', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  )
}

type LogLevel = 'error' | 'info'

const log = (message: any, logLevel: LogLevel) => {
  switch (logLevel) {
    case 'error':
      console.error(chalk.red(message))
      break

    case 'info':
      console.log(chalk.green(message))
      break
  }
}

const parseDocsFolderName = (args: Args = {}): string => {
  return ((args.docs || args.d) as string) || 'docs'
}

const parseConfig = (args: Args = {}): Config => {
  return { isCustomDomain: ((args.customDomain || args.c) as boolean) || false }
}

const add404Html = async (
  baseDir: string,
  docsFolderName: string,
  { isCustomDomain }: Config
): Promise<void> => {
  const src404HtmlFilePath = path.join(__dirname, '../assets/404.html')
  const destPath = path.join(baseDir, docsFolderName)
  const destFilePath = path.join(destPath, '404.html')

  try {
    await fs.access(destPath)
  } catch (error) {
    log(error, 'error')
    throw new Error("docs folder doesn't exist. Please check if you passed the correct docs folder")
  }

  const src404HtmlContent = await fs.readFile(src404HtmlFilePath, 'utf8')
  let processedSrc404HtmlContent: string
  if (!isCustomDomain) {
    processedSrc404HtmlContent = src404HtmlContent.replace(
      'var segmentCount = 0',
      'var segmentCount = 1'
    )
  } else {
    processedSrc404HtmlContent = src404HtmlContent
  }

  await fs.writeFile(destFilePath, processedSrc404HtmlContent)

  log('Add 404.html successfully!!!', 'info')
}

const addScriptToIndexHtml = async (baseDir: string, docsFolderName: string): Promise<void> => {
  const scriptFilePath = path.join(__dirname, '../assets/script.txt')
  const indexHtmlFilePath = path.join(baseDir, docsFolderName, 'index.html')

  try {
    await fs.access(indexHtmlFilePath)
  } catch (error) {
    log(error, 'error')
    throw new Error("index.html doesn't exist. Please check if you passed the correct docs folder")
  }

  const indexHtmlContent = await fs.readFile(indexHtmlFilePath, 'utf8')
  const scriptContent = await fs.readFile(scriptFilePath, 'utf8')
  const $index = cheerio.load(indexHtmlContent)

  if ($index.html().includes(scriptContent)) {
    log(
      'It seems you have already added the SPA script, you only need one script for index.html',
      'info'
    )
  } else {
    // Append spa script to head tag
    $index('head').prepend(scriptContent)

    // Over write old index file with updated one
    await fs.writeFile(indexHtmlFilePath, $index.html())

    log('Add script to index.html successfully!!!', 'info')
  }
}

const makeGHPageSPAFactory = (
  getDocsFolder: typeof parseDocsFolderName,
  getConfig: typeof parseConfig,
  add404: typeof add404Html,
  addScript: typeof addScriptToIndexHtml
) => (args: Args) => {
  logProjectName()

  const baseDir = process.cwd()
  const docsFolderName = getDocsFolder(args)
  const config = getConfig(args)

  Promise.all([add404(baseDir, docsFolderName, config), addScript(baseDir, docsFolderName)])
    .then(() => {
      log(
        'ALL DONE! Your site is now SPA on github page. Publish it to github and enjoy contributing to open source! :)',
        'info'
      )
    })
    .catch(e => {
      log(e, 'error')
      throw e
    })
}

const makeGHPageSPA = makeGHPageSPAFactory(
  parseDocsFolderName,
  parseConfig,
  add404Html,
  addScriptToIndexHtml
)

export {
  Args,
  Config,
  logProjectName,
  log,
  parseDocsFolderName,
  parseConfig,
  add404Html,
  addScriptToIndexHtml,
  makeGHPageSPAFactory,
  makeGHPageSPA
}
