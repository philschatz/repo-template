# repo-template

This repo aims to have the following features:

## Easy Debugging

- [ ] Include sourcemaps:
  - [x] for JS in production
  - [x] source lines in Jest console messages and stacktraces
  - [ ] also CSS
- [ ] Load sourcemaps into browser tests (`puppeteer`)

## Fast Development

- [x] Build TypeScript, and React (`.tsx`) files for code and tests (`npm run build`)
  - [ ] also SASS
- [x] Use an incremental build system because webpack is slow (from 6sec to .2sec)
- [ ] Start a hot-reload development webserver

## Easy Readability

- [ ] Lint files (`npm run lint`)
  - [x] TypeScript (`.ts`, `.tsx`)
  - [x] JavaScript
  - [ ] SASS
  - [ ] JSON
  - [ ] Shell scripts
  - [x] Markdown files
- [x] Auto-generate documentation (`npm run docs`)
  - [ ] verify that docs changed or updated

## Easy Integration

- [ ] API mocks/recordings with multi-step replay
- [ ] Generate TypeScript definitions from JSON Schema files

## Getting Credit

- [ ] Code coverage of _all_ JS code
  - [ ] even when code runs in a browser test
- [ ] Code coverage of CSS files (from running tests)
- [ ] Include accessibility tests and reports

## Easy Dev setup

Getting started should be easy. Here are some options:

- [ ] `./script/setup && ./script/test`
- [ ] `Dockerfile` ?
