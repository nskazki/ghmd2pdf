# ghmd2pdf

* Консольная утилита для конвертации: md → pdf.
* Модуль для конвертации: md → html → pdf.

Способ конвертации:
 1. md → html - используя github API.
 2. html → pdf - используя проект [html-pdf](https://github.com/marcbachmann/node-html-pdf).

### CLI

```
npm i -g ghmd2pdf
```

Опции:
 * `-h` - Help.
 * `-s` - Исходный файл в формате markdown. Используется вместе с `-d`.
 * `-d` - Фал назначения.
 * `-S` - Дирректория в которой будет выполнен рекурсивный поиск markdown файлов. Используется вместе с `-D`.
 * `-D` - Дирриктория назначения, в которой с сохранением иерархии будут сохранены pdf файлы. Имена файлов будет сохранены, изменится только расширение.

### Module

```
npm i -S ghmd2pdf
```

#### ghmd2pdf

```js
var createWriteStream = require('fs').createWriteStream
var ghmd2pdf = require('ghmd2pdf').ghmd2pdf

var destPath = './HelloWorld.pdf'
var dest = createWriteStream(destPath)
ghmd2pdf('# hello world!')
    .pipe(dest)
    .on('end', function() { console.info('done!') })
    .on('error', console.error)
```

#### ghmd2pdfFile

```js
var ghmd2pdfFile = require('ghmd2pdf').ghmd2pdfFile
var sourcePath = './node_modules/ghmd2pdf/README.md'
var destPath = './README.pdf'

ghmd2pdfFile(sourcePath, destPath)
    .then(function() { console.info('done!') })
    .catch(console.error)
```

#### ghmd2html

```js
var ghmd2html = require('ghmd2pdf').ghmd2html

ghmd2html('# hello world!')
    .then(console.info)
    .catch(console.error)
```

#### html2pdf

```js
var createWriteStream = require('fs').createWriteStream
var html2pdf = require('ghmd2pdf').html2pdf

var destPath = './HelloWorld.pdf'
var dest = createWriteStream(destPath)
html2pdf('<h1>hello world!</h1>')
    .pipe(dest)
    .on('end', function() { console.info('done!') })
    .on('error', console.error)
```

## License

MIT
