const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const folderPath = './works';
const resultFilePath = 'result.json';

// 清空 result.json 文件
fs.writeFileSync(resultFilePath, '[]');

// 讀取資料夾內的所有檔案
fs.readdir(folderPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach((file) => {
    if (path.extname(file) === '.html') {
      const filePath = path.join(folderPath, file);

      // 讀取每個 HTML 檔案
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return console.log('Unable to read file: ' + err);
        }

        // 使用 jsdom 解析 HTML 檔案
        const dom = new JSDOM(data);
        const document = dom.window.document;

        // 提取 <h1> 和 <h2> 內容
        const h1 = document.querySelector('h1.work-title') ? document.querySelector('h1.work-title').textContent : '';
        const h2 = document.querySelector('h2.type') ? document.querySelector('h2.type').textContent : '';
        const h2b = document.querySelector('h2.type2') ? document.querySelector('h2.type2').textContent : '';

        // 提取圖片的檔名並構建路徑
        const imageElement = document.querySelector('#start-work-image');
        const imageSrc = imageElement ? `works/img/${path.basename(imageElement.src)}` : '';

        // 構建結果對象
        const result = { h1, h2, h2b, imageSrc, file };

        // 讀取現有的結果文件內容
        const existingData = JSON.parse(fs.readFileSync(resultFilePath, 'utf8'));

        // 添加新的結果
        existingData.push(result);

        // 將更新後的結果寫回到文件中
        fs.writeFileSync(resultFilePath, JSON.stringify(existingData, null, 2));
      });
    }
  });
});
