# repo-template

This repo aims to have the following features:

## Easy Debugging

- [ ] Include sourcemaps:
  - [x] for JS in production
  - [x] source lines in Jest console messages and stacktraces
  - [ ] also CSS
- [x] Stack traces in browser tests should use source maps,
    not line numbers of minified files (see [example Travis Log][sm-exn])

## Fast Development

- [x] Build TypeScript, and React (`.tsx`) files for code and tests (`npm run build`)
  - [ ] also SASS
- [x] Use an incremental build system because webpack is slow (from 6sec to .2sec)
- [x] use Redux
- [ ] Start a hot-reload development webserver

## Easy Readability

- [ ] Lint files (`npm run lint`)
  - [x] TypeScript (`.ts`, `.tsx`)
  - [x] JavaScript
  - [x] SASS/CSS
  - [ ] JSON
  - [ ] Shell scripts
  - [x] Markdown files
- [x] Auto-generate documentation (`npm run docs`)
  - [ ] verify that docs changed or updated

## Easy Integration

- [ ] API mocks/recordings with multi-step replay
- [ ] Generate TypeScript definitions from JSON Schema files

## Getting Credit

- [x] Code coverage of _all_ JS code
  - [ ] even when code runs in a browser test
- [ ] Code coverage of CSS files (from running tests)
- [ ] Include accessibility tests and reports

## Easy Dev setup

Getting started should be easy. Here are some options:

- [ ] `./script/setup && ./script/test`
- [ ] `Dockerfile` ?

[sm-exn]:https://travis-ci.org/philschatz/repo-template/builds/431628513#L492
