'use strict'

var statSync = require('fs').statSync
var resolve = require('path').resolve
var dirname = require('path').dirname
var assert = require('assert')
var mkdirpSync = require('mkdirp').sync

var ghmd2pdf = require('../src-build').ghmd2pdfFile

var src = resolve(__dirname, 'test-data', 'file2file.md')
var dst = resolve(__dirname, 'conv-data', 'file2file.pdf')
var nrm = resolve(__dirname, 'norm-data', 'file2file.etalon.pdf')

mkdirpSync(dirname(dst))

it('file2file', function() {
  return ghmd2pdf(src, dst).then(function() {
    var dstSize = statSync(dst).size
    var nrmSize = statSync(nrm).size
    assert.equal(nrmSize, dstSize, 'hash summ not match')
  })
})
