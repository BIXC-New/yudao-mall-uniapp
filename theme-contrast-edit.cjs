const fs = require('fs');
const path = require('path');
const changed = [];
function walk(directory) {
  for (const name of fs.readdirSync(directory)) {
    const file = path.join(directory, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else if (name.endsWith('.vue') && !file.includes('canvas-poster')) {
      const source = fs.readFileSync(file, 'utf8');
      const result = source.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, (style) => {
        style = style.replace(/(?<![-\w])color:\s*(#[a-f\d]+|\$(?:dark-[1-9]|gray-[a-f]))(?=\s*[;!])/gi, (match, color) => {
          const primary = /^#(?:000|000000|111|111111|222|222222|282828|303030|333|333333|343434|383a46|3b4144|434343|444|444444|484848|515151|555|555555|595959)$/i.test(color) || /^\$dark-[1-4]$/.test(color);
          const secondary = /^#(?:666|666666|6c6c6c|777|777777|888|888888|999|999999|aaa|aaaaaa|bbb|bbbbbb|b3b3b3|c0c0c0|c4c4c4|c6c6c6|ccc|cccccc)$/i.test(color) || /^\$(?:dark-[5-9]|gray-[a-f])$/.test(color);
          return primary || secondary ? `color: var(--ui-TC${secondary ? '-2' : ''}, ${color})` : match;
        });
        style = style.replace(/(background(?:-color)?:\s*)(#fff(?:fff)?|#f[0-9a-f]{5}|#eee(?:eee)?|#ececec|#e5e5e5)(?=\s*;)/gi, (match, prefix, color) => {
          const neutral = /^#(?:fff|ffffff|f[\da-f])$/i.test(color) || /^#([\da-f]{2})\1\1$/i.test(color) || ['#f5f6f8', '#f8f9fa', '#f7f6f6', '#f2f6fc'].includes(color.toLowerCase());
          if (!neutral) return match;
          return `${prefix}var(--ui-BG${/^#fff(?:fff)?$/i.test(color) ? '' : '-2'}, ${color})`;
        });
        style = style.replace(/((?:border(?:-(?:top|bottom|left|right))?(?:-color)?):[^;{}]*?)(#[a-f\d]+)(?=\s*(?:solid)?\s*;)/gi, (match, prefix, color) => /^#(?:ddd|dddddd|dfdfdf|eee|eeeeee|e5e5e5|e4e7ed|f0f0f0|f5f5f5)$/i.test(color) ? `${prefix}var(--ui-Border, ${color})` : match);
        // 当前规则块明确使用主题色背景时，按钮文字使用成对的对比色。
        style = style.replace(/\{([^{}]*)\}/g, (block, declarations) => /background[^;]*var\(--ui-BG-Main\)/.test(declarations) && !/background[^;]*var\(--ui-BG-Main-(?:light|tag|opacity)/.test(declarations)
          ? block.replace(/(?<![-\w])color:\s*(#fff(?:fff)?|\$white)(?=\s*;)/gi, 'color: var(--ui-BG-Main-TC, $1)') : block);
        return style;
      });
      if (result !== source) { fs.writeFileSync(file, result); changed.push(file); }
    }
  }
}
['pages', 'sheep/components', 'sheep/ui'].forEach(walk);
console.log(changed.join('\n'));
