const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'app', 'components');

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts'));

for (const file of files) {
  const compName = file.replace('.component.ts', '');
  const folderPath = path.join(dir, compName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const content = fs.readFileSync(path.join(dir, file), 'utf8');

  const match = content.match(/template:\s*`([\s\S]*?)`/);
  if (match) {
    const htmlContent = match[1].trim();
    fs.writeFileSync(
      path.join(folderPath, compName + '.component.html'),
      htmlContent,
      'utf8'
    );

    let newTsContent = content.replace(
      /template:\s*`[\s\S]*?`/,
      `templateUrl: './${compName}.component.html'`
    );
    fs.writeFileSync(path.join(folderPath, file), newTsContent, 'utf8');

    fs.unlinkSync(path.join(dir, file));
  }
}

const appFilePath = path.join(__dirname, 'src', 'app', 'app.component.ts');
let appContent = fs.readFileSync(appFilePath, 'utf8');
appContent = appContent.replace(
  /from '\.\/components\/([a-z\-]+)\.component'/g,
  "from './components/$1/$1.component'"
);
fs.writeFileSync(appFilePath, appContent, 'utf8');
console.log('Done refactoring!');
