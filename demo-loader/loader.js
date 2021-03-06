var path = require('path')
var fs = require('fs')
var marked = require('marked')
var loaderUtils = require('loader-utils')

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang) {
    return require('highlight.js').highlight(lang, code).value;
  }
})

module.exports = function (source) {

  if (this.cacheable) this.cacheable()

  var loaderContext = this
  var query = loaderUtils.parseQuery(this.query)
  var filePath = this.resourcePath
  var fileName = path.basename(filePath)
  var name = fileName.substr(0, fileName.lastIndexOf('.'))
  var docPath = path.join(filePath, '..', name)
  var explainPath = path.join(filePath, '..', name, name + '.md')
  var docFiles

  if (query.post) {
    if (fs.existsSync(filePath + '.cache')) {
      // fs.unlinkSync(filePath + '.cache')
    }
    return source
  }

  try {
    docFiles = fs.readdirSync(docPath)
  } catch(e) {
    throw new Error(docPath + ' does not exist')
  }

  var html = '', components = '', code, demoFilePath

  // var self = this
  this.addContextDependency(docPath)

  docFiles.forEach(function (f, index) {
    if (path.extname(f) === '.vue') {
      demoFilePath = path.join(docPath, f)
      code = fs.readFileSync(demoFilePath, 'utf8')
      // self.addDependency(demoFilePath)
      html += (
        '<code-panel filename="' + f + '">\n' +
          '<div slot="demo">\n' +
            '<demo' + index + '></demo' + index + '>\n' +
          '</div>\n' +
          '<div slot="code">\n' +
            marked(`\`\`\`html\n ${code} \n\`\`\``) + '\n' +
          '</div>\n' +
        '</code-panel>\n'
      )
      components += 'demo' + index + ':' + ' require(\'./' + name + '/' + f + '\'),'
    }
  })

  // console.log(explainPath)
  if (fs.existsSync(explainPath)) {
    // this.addDependency(explainPath)
    var explain = fs.readFileSync(explainPath, 'utf8')
    html += (
      '<div class="explain markdown-body">' +
        marked(explain) +
      '</div>'
    )
  }

  var scripts = "<script>\n" +
      "export default {\n" +
        "components: {\n" + components + "\n}\n" +
      "}\n" +
      "</script>"

  var templates = "<template>\n" +
      html + '\n' +
      "</template>"

  var finalPath = path.join(filePath, '..', '.' + name + '.doc.cache')

  fs.writeFileSync(finalPath, templates + '\n\n' + scripts, 'utf8')

  function getRequest() {
    return loaderUtils.stringifyRequest(loaderContext,
      '!!vue!' + finalPath)
  }

  return 'module.exports = require(' + getRequest() + ')'

}
