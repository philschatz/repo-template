import {createHash} from 'crypto'
import * as puppeteer from 'puppeteer'
import * as pti from 'puppeteer-to-istanbul'
import mapStackTrace from 'sourcemapped-stacktrace-node'

const HARNESS_FILE = `file://${__dirname}/browser/harness.xhtml`

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


async function startBrowser(url: string) {

    const puppeteerArgs = []
    // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
    if (process.env.CI === 'true') {
        puppeteerArgs.push('--no-sandbox')
    }

    const browser = await puppeteer.launch({
        devtools: process.env.NODE_ENV === 'development',
        args: puppeteerArgs
    })
    const page = await browser.newPage()

    // Enable both JavaScript and CSS coverage
    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ])

    // redirect browser console messages to the terminal
    page.on('console', (consoleMessage) => {
        const type = consoleMessage.type()
        const text = consoleMessage.text()

        const fn = console[type] || console.log
        fn.apply(console, [text])
    })

    page.on('pageerror', async (e) => {
        const newStack = await mapStackTrace(e/*.message*/, { isChromeOrEdge: true })
        console.error(`BUG: Browser threw an Error!`)
        console.error(e)
        console.error(newStack)
        expect(newStack).toBeNull() // Just cause Jest to fail
        // throw new Error(newStack)
    })

    await page.goto(url)

    return {page, browser}
}

async function evaluateWithStackTrace(page: puppeteer.Page, fn: puppeteer.EvaluateFn, ...args: any[]) {
    try {
        return await page.evaluate(fn, ...args)
    } catch (e) {
        const stack = e.stack
        const message = stack.split('\n')[0]
        const newStack = await mapStackTrace(stack, { isChromeOrEdge: true })
        console.error(`${message}\n${newStack}`)
        e.stack = newStack
        throw e
    }
}

async function injectCoverageCollection (page) {
    // From https://github.com/GoogleChrome/puppeteer/pull/1067/files
    debugger
    if ('__coverage__' in global) {
      const coverageObjects = {}
      Object.keys(global['__coverage__']).forEach(filename => {
        // The variable name of the coverage object is a hash of the filename
        // Istanbul computes this so we need to compute it as well.
        const hash = createHash('sha1')
        hash.update(filename)
        const key = parseInt(hash.digest('hex').substr(0, 12), 16).toString(36)
        coverageObjects[key] = global['__coverage__'][filename]
      })
      await page.exposeFunction('cv_proxy_add', /* istanbul ignore next */ async arr => {
        arr = JSON.parse(arr)
        let obj = coverageObjects
        while (arr.length > 1) { obj = obj[arr.shift()] }
        obj[arr.shift()]++
      })
      await page.evaluate(/* istanbul ignore next */ keys => {
          debugger
        const createProxy = parents => {
          parents = parents.slice()
          return new Proxy({}, {
            get: (target, name) => 0,
            set: (obj, prop, value) => {
              const arr = parents.concat([prop])
              window['cv_proxy_add'](JSON.stringify(arr))
              return true
            }
          })
        }
        keys.forEach(key => {
          window[`cov_${key}`] = {
            f: createProxy([key, 'f']),
            s: createProxy([key, 's']),
            b: createProxy([key, 'b'])
          }
        })
      }, Object.keys(coverageObjects))
    }
  }

describe('Renders pages in headless chrome', () => {
    it('renders a simple React component', async () => {
        // browser tests are slow. Increase the timeout
        jest.setTimeout(90 * 1000) // 90sec

        const {page, browser} = await startBrowser(HARNESS_FILE)
        // await injectCoverageCollection(page)
        const uniqueStringToCheckFor = 'UNIQUE_STRING_TO_CHECK_FOR'
        await evaluateWithStackTrace(page, (uniqueStringToCheckFor) => {
            const {React, ReactDOM, Hello} = window['TEST_COMPONENTS']
            ReactDOM.render(React.createElement(Hello, { name: uniqueStringToCheckFor }), document.getElementById('mainContentArea'))
        }, uniqueStringToCheckFor)

        // Check that the component rendered
        const pageContent = await page.content()
        expect(pageContent.indexOf(uniqueStringToCheckFor) >= 0).toBe(true)

        // Disable both JavaScript and CSS coverage
        const [jsCoverage, cssCoverage] = await Promise.all([
            page.coverage.stopJSCoverage(),
            page.coverage.stopCSSCoverage(),
        ]);
        pti.write(jsCoverage)

        await browser.close()
    })


    it.skip('reports the sourcemapped stack trace when browser code is evaluated', async () => {
        // browser tests are slow. Increase the timeout
        jest.setTimeout(90 * 1000) // 90sec

        const {page, browser} = await startBrowser(HARNESS_FILE)
        await evaluateWithStackTrace(page, () => {
            const { throwErrorNow } = window['TEST_COMPONENTS']
            throwErrorNow()
        })
        await sleep(15 * 1000) // wait for an exception to occur
        await browser.close()
    })

    it.skip('reports the sourcemapped stack trace when browser code is evaluated (delayed error)', async () => {
        // browser tests are slow. Increase the timeout
        jest.setTimeout(90 * 1000) // 90sec

        const {page, browser} = await startBrowser(HARNESS_FILE)
        await evaluateWithStackTrace(page, () => {
            const { throwErrorAfterDelay } = window['TEST_COMPONENTS']
            throwErrorAfterDelay(1 * 1000)
        })
        await sleep(5 * 1000) // wait for an exception to occur
        await browser.close()
    })

})