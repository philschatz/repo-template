/**
 * This immediately causes an error (to verify the stack trace was rewritten)
 */
export function throwErrorNow() {
    innerFunctionThrow(`Checking to see if line numbers are sourcemapped since this is webpacked (immediate)`)
}

function innerFunctionThrow(message: string) {
    throw new Error(message)
}

/**
 * This causes a delayed error outside of normal execution (to verify the stack trace was rewritten)
 */
export function throwErrorAfterDelay(ms: number) {
    setTimeout(() => {
        innerFunctionThrow(`Checking to see if line numbers are sourcemapped since this is webpacked (delayed)`)
    }, ms || (5 * 1000))
}
