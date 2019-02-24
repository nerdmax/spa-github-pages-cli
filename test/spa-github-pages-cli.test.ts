/* tslint:disable:no-console */
import chalk from 'chalk'
import * as cheerio from 'cheerio'
import * as fs from 'fs-extra'
import * as path from 'path'
import {
  add404Html,
  addScriptToIndexHtml,
  Args,
  Config,
  log,
  logProjectName,
  makeGHPageSPAFactory,
  parseConfig,
  parseDocsFolderName
} from '../src/spa-github-pages-cli'

const mockedInitConfig: Config = {
  isCustomDomain: false
}

beforeEach(async () => {
  jest.clearAllMocks()
  const sampleIndexHtmlFilePath = path.join(__dirname, 'fixtures/index.html')
  const ErrorHtmlFilePath = path.join(__dirname, 'fixtures/404.html')
  const testDocsFolderPath = path.join(__dirname, 'docs')
  const testDocsFilePath = path.join(testDocsFolderPath, 'index.html')

  // Add index.html
  try {
    await fs.access(testDocsFolderPath)
  } catch (error) {
    await fs.mkdir(testDocsFolderPath)
  }

  await fs.copy(sampleIndexHtmlFilePath, testDocsFilePath)

  // Remove 404.html
  await fs.remove(ErrorHtmlFilePath)
})

describe('logProjectName', () => {
  it('calls console.log', () => {
    const mockedConsoleLog = jest.spyOn(console, 'log')
    logProjectName()
    expect(mockedConsoleLog).toHaveBeenCalled()
  })
})

describe('log', () => {
  const mockedMessage = 'mocked message'

  describe('with info level', () => {
    it('calls console.log with mocked message', () => {
      const mockedConsoleLog = jest.spyOn(console, 'log')
      log(mockedMessage, 'info')
      expect(mockedConsoleLog).toHaveBeenCalledWith(chalk.green(mockedMessage))
    })
  })

  describe('with error level', () => {
    it('calls console.error with mocked message', () => {
      const mockedConsoleError = jest.spyOn(console, 'error')
      log(mockedMessage, 'error')
      expect(mockedConsoleError).toHaveBeenCalledWith(chalk.red(mockedMessage))
    })
  })
})

describe('getDocsFolderName', () => {
  const mockedFolderName = 'mocked folder name'

  describe('with docs passed in', () => {
    it('returns mocked folder name', () => {
      expect(parseDocsFolderName({ docs: mockedFolderName })).toBe(mockedFolderName)
    })
  })

  describe('with d passed in', () => {
    it('returns mocked folder name', () => {
      expect(parseDocsFolderName({ d: mockedFolderName })).toBe(mockedFolderName)
    })
  })

  describe('with nothing passed in', () => {
    it('returns docs', () => {
      expect(parseDocsFolderName()).toBe('docs')
    })
  })
})

describe('parseConfig', () => {
  const mockedIsCustomDomain = true
  describe('with customDomain passed in', () => {
    it('returns mocked isCustomDomain', () => {
      expect(parseConfig({ customDomain: true })).toEqual({ isCustomDomain: mockedIsCustomDomain })
    })
  })

  describe('with c passed in', () => {
    it('returns mocked isCustomDomain', () => {
      expect(parseConfig({ c: true })).toEqual({ isCustomDomain: mockedIsCustomDomain })
    })
  })

  describe('with nothing passed in', () => {
    it('returns false', () => {
      expect(parseConfig()).toEqual({ isCustomDomain: false })
    })
  })
})

describe('add404Html', () => {
  const baseDir = __dirname
  const docsFolderName = 'docs'

  describe('with docs dir existed', () => {
    describe('with isCustomDomain set to false', () => {
      it('copies 404.html and changes segmentCount to 1', async () => {
        await add404Html(baseDir, docsFolderName, mockedInitConfig)
        const original404HtmlContent = (await fs.readFile(
          path.join(__dirname, '../assets/404.html'),
          'utf8'
        )).replace('var segmentCount = 0', 'var segmentCount = 1')
        const copied404HtmlContent = await fs.readFile(
          path.join(__dirname, 'docs/404.html'),
          'utf8'
        )
        expect(original404HtmlContent).toEqual(copied404HtmlContent)
      })
    })

    describe('with isCustomDomain set to true', () => {
      it('copies 404.html', async () => {
        await add404Html(baseDir, docsFolderName, { ...mockedInitConfig, isCustomDomain: true })
        const original404HtmlContent = await fs.readFile(
          path.join(__dirname, '../assets/404.html'),
          'utf8'
        )
        const copied404HtmlContent = await fs.readFile(
          path.join(__dirname, 'docs/404.html'),
          'utf8'
        )
        expect(original404HtmlContent).toEqual(copied404HtmlContent)
      })
    })
  })

  describe('with docs dir not existed', () => {
    it('throws error', async () => {
      await fs.remove(path.join(__dirname, 'docs'))
      try {
        await add404Html(baseDir, docsFolderName, mockedInitConfig)
      } catch (error) {
        expect(error.message).toEqual(
          "docs folder doesn't exist. Please check if you passed the correct docs folder"
        )
      }
    })
  })
})

describe('addScriptToIndexHtml', () => {
  const baseDir = path.join(process.cwd(), 'test')
  const docsFolderName = 'docs'

  describe('with index.html existed', () => {
    it('adds scripts to index.html', async () => {
      await addScriptToIndexHtml(baseDir, docsFolderName)

      const scriptContent = await fs.readFile(path.join(__dirname, '../assets/script.txt'), 'utf8')
      const $script = cheerio.load(scriptContent, {
        xmlMode: true
      })
      const expectedScriptStartComment = $script.root()[0].children[0].data
      const expectedNoteComment = $script.root()[0].children[2].data
      const expectedScriptMainContent = $script.root()[0].children[4].children[0].data
      const expectedScriptEndComment = $script.root()[0].children[6].data

      const copiedIndexHtmlContent = await fs.readFile(
        path.join(__dirname, 'docs/index.html'),
        'utf8'
      )
      const $index = cheerio.load(copiedIndexHtmlContent)
      const childrenLength = $index('head')[0].children.length
      const actualScriptStartComment = $index('head')[0].children[childrenLength - 8].data
      const actualNoteComment = $index('head')[0].children[childrenLength - 6].data
      const actualScriptMainContent = $index('head')[0].children[childrenLength - 4].children[0]
        .data
      const actualScriptEndComment = $index('head')[0].children[childrenLength - 2].data

      expect(actualScriptStartComment).toEqual(expectedScriptStartComment)
      expect(actualNoteComment).toEqual(expectedNoteComment)
      expect(actualScriptMainContent).toEqual(expectedScriptMainContent)
      expect(actualScriptEndComment).toEqual(expectedScriptEndComment)
    })
  })

  describe('with index.html and spa script existed', () => {
    it('adds scripts to index.html only once', async () => {
      await addScriptToIndexHtml(baseDir, docsFolderName)
      await addScriptToIndexHtml(baseDir, docsFolderName)

      const scriptContent = await fs.readFile(path.join(__dirname, '../assets/script.txt'), 'utf8')
      const $script = cheerio.load(scriptContent, {
        xmlMode: true
      })
      const scriptStartComment = $script.root()[0].children[0].data
      const noteComment = $script.root()[0].children[2].data
      const scriptMainContent = $script.root()[0].children[4].children[0].data
      const scriptEndComment = $script.root()[0].children[6].data

      const copiedIndexHtmlContent = await fs.readFile(
        path.join(__dirname, 'docs/index.html'),
        'utf8'
      )
      const $index = cheerio.load(copiedIndexHtmlContent)
      const $indexHeadChildren = $index('head')[0].children
      const actualScriptStartComment = $indexHeadChildren.filter(
        $indexHeadChild => $indexHeadChild.data === scriptStartComment
      )
      const actualNoteComment = $indexHeadChildren.filter(
        $indexHeadChild => $indexHeadChild.data === noteComment
      )
      const actualScriptMainContent = $indexHeadChildren.filter(
        $indexHeadChild =>
          $indexHeadChild.children &&
          $indexHeadChild.children[0] &&
          $indexHeadChild.children[0].data === scriptMainContent
      )
      const actualScriptEndComment = $indexHeadChildren.filter(
        $indexHeadChild => $indexHeadChild.data === scriptEndComment
      )

      expect(actualScriptStartComment.length).toEqual(1)
      expect(actualNoteComment.length).toEqual(1)
      expect(actualScriptMainContent.length).toEqual(1)
      expect(actualScriptEndComment.length).toEqual(1)
    })
  })

  describe('with index.html not existed', () => {
    it('throws error', async () => {
      await fs.remove(path.join(__dirname, 'docs/index.html'))
      try {
        await addScriptToIndexHtml(baseDir, docsFolderName)
      } catch (error) {
        expect(error.message).toEqual(
          "index.html doesn't exist. Please check if you passed the correct docs folder"
        )
      }
    })
  })
})

describe('makeGHPageSPAFactory', () => {
  const mockedFolderName = 'mocked folder name'
  const mockedArgv = { docs: mockedFolderName }
  const mockedError = 'mocked error'

  describe('with everything working fine', () => {
    it('calls functions with desired parameters', () => {
      const mockedParseDocsFolderName = jest.fn().mockReturnValue(mockedFolderName)
      const mockedParseConfig = jest.fn().mockReturnValue(mockedInitConfig)
      const mockedAdd404Html = jest.fn()
      const mockedAddScriptToIndexHtml = jest.fn()
      makeGHPageSPAFactory(
        mockedParseDocsFolderName,
        mockedParseConfig,
        mockedAdd404Html,
        mockedAddScriptToIndexHtml
      )(mockedArgv)
      expect(mockedParseDocsFolderName).toHaveBeenCalledWith(mockedArgv)
      expect(mockedParseConfig).toHaveBeenCalledWith(mockedArgv)
      expect(mockedAdd404Html).toHaveBeenCalledWith(
        process.cwd(),
        mockedFolderName,
        mockedInitConfig
      )
      expect(mockedAddScriptToIndexHtml).toHaveBeenCalledWith(process.cwd(), mockedFolderName)
    })
  })

  describe('with promise throwing error', () => {
    it('throws error', () => {
      const mockedGetDocsFolderName = jest.fn()
      const mockedParseConfig = jest.fn()
      const mockedAdd404Html = jest.fn().mockRejectedValue(mockedError)
      const mockedAddScriptToIndexHtml = jest.fn()
      makeGHPageSPAFactory(
        mockedGetDocsFolderName,
        mockedParseConfig,
        mockedAdd404Html,
        mockedAddScriptToIndexHtml
      )(mockedArgv)
    })
  })
})
