import * as puppeteer from 'puppeteer'
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

describe('Renders pages in headless chrome', () => {
    it('renders a simple React component', async () => {
        // browser tests are slow. Increase the timeout
        jest.setTimeout(90 * 1000) // 90sec

        const {page, browser} = await startBrowser(HARNESS_FILE)
        const uniqueStringToCheckFor = 'UNIQUE_STRING_TO_CHECK_FOR'
        await evaluateWithStackTrace(page, (uniqueStringToCheckFor) => {
            const {React, ReactDOM, Hello} = window.TEST_COMPONENTS
            ReactDOM.render(React.createElement(Hello, { name: uniqueStringToCheckFor }), document.getElementById('mainContentArea'))
        }, uniqueStringToCheckFor)

        // Check that the component rendered
        const pageContent = await page.content()
        expect(pageContent.indexOf(uniqueStringToCheckFor) >= 0).toBe(true)
        await browser.close()
    })


    it('reports the sourcemapped stack trace when browser code is evaluated', async () => {
        // browser tests are slow. Increase the timeout
        jest.setTimeout(90 * 1000) // 90sec

        const {page, browser} = await startBrowser(HARNESS_FILE)
        await evaluateWithStackTrace(page, () => {
            const { throwErrorNow } = window.TEST_COMPONENTS
            throwErrorNow()
        })
        await sleep(15 * 1000) // wait for an exception to occur
        await browser.close()
    })

    it('reports the sourcemapped stack trace when browser code is evaluated (delayed error)', async () => {
        // browser tests are slow. Increase the timeout
        jest.setTimeout(90 * 1000) // 90sec

        const {page, browser} = await startBrowser(HARNESS_FILE)
        await evaluateWithStackTrace(page, () => {
            const { throwErrorDelay } = window.TEST_COMPONENTS
            throwErrorDelay(1 * 1000)
        })
        await sleep(5 * 1000) // wait for an exception to occur
        await browser.close()
    })

})