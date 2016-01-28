'use strict'

import commander from 'commander'
import Logger from 'bellman'
import { resolve, basename, extname, dirname } from 'path'
import { isString, isUndefined } from 'lodash'
import { readdirSync, statSync } from 'fs'
import P from 'bluebird'
import { sync as mkdirp } from 'mkdirp'
import { ghmd2pdfFile as ghmd2pdf } from '../src-build'
import chalk from 'chalk'

let logger = new Logger().reg()
process.on('uncaughtException', err => {
  logger.error('uncaughtException: %s', err)
  process.reallyExit(2)
})

let cResolve = p => resolve(process.cwd(), p)
let cli = commander
  .allowUnknownOption()
  .usage('[options]')
  .option('-s, --source-file <path>',
    'set source file. use with --dest-file.', cResolve)
  .option('-d, --dest-file <path>',
    'set dest file.', cResolve)
  .option('-S, --source-dir <path>',
    'set source dir. use with --dest-dir.', cResolve)
  .option('-D, --dest-dir <path>',
    'set dest dir.', cResolve)
  .parse(process.argv)

if (!(isString(cli.sourceFile) && isString(cli.destFile))
  && !(isString(cli.sourceDir) && isString(cli.destDir))) {
  commander.help()
  process.reallyExit(0)
}

let sourceExt = '.md'
let destExt = '.pdf'
let pairs = isString(cli.sourceFile) && isString(cli.destFile)
  ? [ { source: cli.sourceFile, dest: cli.destFile } ]
  : findPairs(cli.sourceDir, cli.destDir, sourceExt, destExt)

P
  .resolve(pairs)
  .map(p => {
    mkdirp(dirname(p.dest))
    return ghmd2pdf(p.source, p.dest)
      .then(() => {
        console.info(`${chalk.green('✓')} ${p.source}  →  ${p.dest}`)
      })
      .catch(err => {
        console.error(`${chalk.red('✗')} ${p.source}  →  ${p.dest}`)
        console.error('\t%s', err.toString().split('\r').join('\r\t'))
      })
  })
  .catch(err => {
    logger.error('unexpected problem: %s', err)
    process.reallyExit(2)
  })

// helpers

function findPairs(sourceDir, destDir, sourceExt, destExt) {
  return readdirSync(sourceDir)
    .map(source => resolve(sourceDir, source))
    .map(source => {
      if (statSync(source).isDirectory()) {
        let dest = resolve(destDir, basename(source))
        return findPairs(source, dest, sourceExt, destExt)
      } else if (extname(source) === sourceExt) {
        let name = basename(source).replace(sourceExt, destExt)
        let dest = resolve(destDir, name)
        return [ { source, dest } ]
      }
    })
    .filter(pair => !isUndefined(pair))
    .reduce((acc, part) => acc.concat(part), [])
}

