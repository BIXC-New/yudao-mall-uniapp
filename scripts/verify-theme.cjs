const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const compiler = require(path.resolve(root, '../yudao-ui-admin-vue3/node_modules/vue/compiler-sfc'));
const git = process.env.GIT_BIN || (process.platform === 'win32' ? 'D:/Program Files/Git/bin/git.exe' : 'git');
const files = execFileSync(git, ['diff', '--name-only', '--diff-filter=ACM', '--', '*.vue'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
for (const file of files) {
  const { descriptor, errors } = compiler.parse(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
  if (errors.length) throw errors[0];
  if (descriptor.script || descriptor.scriptSetup) compiler.compileScript(descriptor, { id: file });
  if (descriptor.template) {
    const result = compiler.compileTemplate({ source: descriptor.template.content, filename: file, id: file });
    if (result.errors.length) throw new Error(file + ': ' + result.errors.join('\n'));
  }
}
console.log(files.length + ' changed Vue SFCs compiled successfully');
