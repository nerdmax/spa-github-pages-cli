#!/usr/bin/env node
import chalk from 'chalk'
import * as cheerio from 'cheerio'
import * as figlet from 'figlet'
import * as fs from 'fs-extra'
import * as path from 'path'

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

const getDocsFolderName = (argv: { [x: string]: string } = {}): string => {
  return argv.docs || argv.d || 'docs'
}

const add404Html = async (baseDir: string, docsFolderName: string): Promise<void> => {
  const srcFilePath = path.join(__dirname, '../assets/404.html')
  const destPath = path.join(baseDir, docsFolderName)
  const destFilePath = path.join(destPath, '404.html')

  try {
    await fs.access(destPath)
  } catch (error) {
    log(error, 'error')
    throw new Error("docs folder doesn't exist. Please check if you passed the correct docs folder")
  }

  await fs.copy(srcFilePath, destFilePath)

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
    $index('head').append(scriptContent)

    // Over write old index file with updated one
    await fs.writeFile(indexHtmlFilePath, $index.html())

    log('Add script to index.html successfully!!!', 'info')
  }
}

const makeGHPageSPAFactory = (
  getDocsFolder: typeof getDocsFolderName,
  add404: typeof add404Html,
  addScript: typeof addScriptToIndexHtml
) => (argv: any) => {
  logProjectName()

  const baseDir = process.cwd()
  const docsFolderName = getDocsFolder(argv)

  Promise.all([add404(baseDir, docsFolderName), addScript(baseDir, docsFolderName)])
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

const makeGHPageSPA = makeGHPageSPAFactory(getDocsFolderName, add404Html, addScriptToIndexHtml)

export {
  logProjectName,
  log,
  getDocsFolderName,
  add404Html,
  addScriptToIndexHtml,
  makeGHPageSPAFactory,
  makeGHPageSPA
}
