// 转码
var iconv = require('iconv-lite');
var fs = require('fs');

const csvFilePath = './blockly-en.csv';
const csv = require('csvtojson');

var content = {};
var files = ['./blockly-en.csv', './blockly-zero-en.csv'];
// var files = ['./blockly-en.csv'];
var files = ['./blockly-zero-en.csv'];

for(var f in files) {
  var folderName = files[f].split('./')[1].split('.csv')[0];
  generateJsonFromCsv(folderName, files[f]);

  // (function() {
  //   setTimeout(function(f) {
  //     generateJsonFromCsv(folderName, files[f]);
  //   }, 100);
  // })(f);
}

function generateJsonFromCsv(folder, csvFilePath) {
  csv()
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    var lanfiles = ['zh', 'en'];

    var row = jsonObj;
    for (var j = 0; j < lanfiles.length; j++) {
      content[lanfiles[j]] = content[lanfiles[j]] || "";
      var rowStr = row.key + ' = "' + row[lanfiles[j]] + '";\n';
      content[lanfiles[j]] += rowStr;
    }

    // 写入文件
    for (k in lanfiles) {
      writeFile(folder, lanfiles[k], content[lanfiles[k]]);
    }
  })
  .on('done', (error) => {
    content = {};
    console.log('done')
  });
}

function writeFile(folder, fileName, content) {
  var filepath = folder + '/' + fileName + '.js';
  var arr = iconv.encode(content, 'utf-8');

  // appendFile，如果文件不存在，会自动创建新文件
  // 如果用 writeFile ，那么会删除旧文件，直接写新文件
  fs.writeFile(filepath, arr, function(err) {
    if (err) {
      console.log("fail " + err);
    }
    else {
      // console.log("写入文件ok");
    }
  });
}

