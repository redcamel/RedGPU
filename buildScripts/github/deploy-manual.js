const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../manual/.vitepress/dist');
const targetDir = path.join(__dirname, '../../manual');

// manual 폴더 내의 기존 파일 삭제 (소스 제외)
const excludeDirs = ['.vitepress', 'api', 'ko', 'en', 'public', 'assets'];
const excludeFiles = ['index.md'];

function cleanManualDir() {
  const items = fs.readdirSync(targetDir);
  items.forEach(item => {
    const itemPath = path.join(targetDir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && !excludeDirs.includes(item)) {
      fs.rmSync(itemPath, { recursive: true, force: true });
      console.log(`Deleted directory: ${item}`);
    } else if (stat.isFile() && !excludeFiles.includes(item)) {
      fs.unlinkSync(itemPath);
      console.log(`Deleted file: ${item}`);
    }
  });
}

// dist 폴더 내용을 manual 폴더로 복사
function copyDistToManual() {
  const items = fs.readdirSync(sourceDir);
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      fs.cpSync(sourcePath, targetPath, { recursive: true });
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
    console.log(`Copied: ${item}`);
  });
}

console.log('Cleaning manual directory...');
cleanManualDir();

console.log('\nCopying build files to manual directory...');
copyDistToManual();

console.log('\n✅ Manual deployment completed!');
console.log('Run "npm run serve" and visit http://localhost:8080/manual/');
