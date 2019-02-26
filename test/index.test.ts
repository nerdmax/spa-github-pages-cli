import { parser } from '../src/index'

describe('yargs parser', () => {
  describe('gets called with --help', () => {
    it('console.log some instructions', async () => {
      const output = await new Promise(resolve => {
        parser.parse('--help', (err: any, argv: any, output: string) => {
          resolve(output)
        })
      })

      expect(output).toEqual(
        expect.stringContaining(
          'This cli tool can make your site SPA friendly when hosting by github pages'
        )
      )

      expect(output).toEqual(expect.stringContaining('--version'))
      expect(output).toEqual(expect.stringContaining('Show version number'))

      expect(output).toEqual(expect.stringContaining('-d, --docs'))
      expect(output).toEqual(expect.stringContaining("The folder's name that contains index.html"))
      expect(output).toEqual(expect.stringContaining('[string] [default: "docs"]'))

      expect(output).toEqual(expect.stringContaining('-c, --customDomain'))
      expect(output).toEqual(
        expect.stringContaining('Set to true if you are using a custom domain')
      )
      expect(output).toEqual(expect.stringContaining('[boolean] [default: false]'))

      expect(output).toEqual(expect.stringContaining('--help'))
      expect(output).toEqual(expect.stringContaining('Show help'))
    })
  })
})
