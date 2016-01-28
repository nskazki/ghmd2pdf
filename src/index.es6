'use strict'

import { readFileSync, readFile as nReadFile, createWriteStream } from 'fs'
import { isNull } from 'lodash'
import { resolve } from 'path'
import P, { promisifyAll, promisify } from 'bluebird'
import nRequest from 'request'
import promisePipe from 'promisepipe'
import pdf from 'html-pdf'

let request = promisifyAll(nRequest)
let readFile = promisify(nReadFile)

let defTmpPath = resolve(__dirname, '../template/github.tmp.html')
let defHtmlTmp = readFileSync(defTmpPath, 'utf8')

export async function ghmd2pdf(ghmd, htmlTmp = defHtmlTmp) {
  try {
    let html = await ghmd2html(ghmd, htmlTmp)
    return await html2pdf(html)
  } catch (err) {
    err.message = `Convert from text to pipe problem: \n${err.message}`
    throw err
  }
}

export async function ghmd2pdfFile(sourcePath, destPath, htmlTmp = defHtmlTmp) {
  try {
    let ghmd = await readFile(sourcePath, 'utf8')
    let pdfS = await ghmd2pdf(ghmd, htmlTmp)
    let dest = createWriteStream(destPath)
    return await promisePipe(pdfS, dest)
  } catch (err) {
    err.message = `Convert from file to file problem: \n${err.message}`
    throw err
  }
}

export async function ghmd2html(ghmd, htmlTmp = defHtmlTmp) {
  try {
    var options = {
      url: 'https://api.github.com/markdown',
      headers: { 'User-Agent' : 'ghmd2pdf' },
      json: true,
      body: { text: ghmd, mod: 'markdown' }
    }

    return await request
      .postAsync(options)
      .get(1)
      .then(body => htmlTmp.replace('{{BODY}}', body))
  } catch (err) {
    err.message = `Convert from ghmd to html problem: \n${err.message}`
    throw err
  }
}

export async function html2pdf(html) {
  try {
    return new P((res, rej) => pdf
      .create(html)
      .toStream((err, stm) => isNull(err)
        ? res(stm)
        : rej(err)))
  } catch (err) {
    err.message = `Convert from html to pdf problem: \n${err.message}`
    throw err
  }
}
