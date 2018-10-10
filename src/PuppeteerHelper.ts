import * as puppeteer from 'puppeteer'
import mapStackTrace from 'sourcemapped-stacktrace-node'

// This lives in the src directory so we can collect code coverage from browser tests
export class PuppeteerHelper {

    private browser: puppeteer.Browser | null

    constructor() {
        this.browser = null
    }

    async start() {
        if (!this.browser) {
            const puppeteerArgs = []
            // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
            if (process.env.CI === 'true') {
                puppeteerArgs.push('--no-sandbox')
            }

            this.browser = await puppeteer.launch({
                devtools: process.env.NODE_ENV === 'development',
                args: puppeteerArgs
            })
        }
        const page = await this.browser.newPage()

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
            throw new Error(newStack)
        })

        return page
    }

    async stop() {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }

    async evaluateWithStackTrace(page: puppeteer.Page, fn: puppeteer.EvaluateFn, ...args: any[]) {
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

}