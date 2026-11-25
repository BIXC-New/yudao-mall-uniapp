const fs = require('fs');
const edit = (file, pairs) => {
  let source = fs.readFileSync(file, 'utf8');
  for (const [from, to] of pairs) {
    if (!source.includes(from)) throw new Error(file + ': missing ' + from);
    source = source.split(from).join(to);
  }
  fs.writeFileSync(file, source);
};
edit('uni_modules/uni-icons/components/uni-icons/uni-icons.vue', [["default: '#333333'", "default: 'var(--ui-TC-2, #333333)'"]]);
edit('uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue', [
  ['color="#c0c4cc"', 'color="var(--ui-TC-2, #737373)"'],
  ['class="uni-searchbar__box-search-input"', 'class="uni-searchbar__box-search-input" placeholder-style="color: var(--ui-Placeholder, #737373)"'],
  ['default: "#F8F8F8"', 'default: "var(--ui-Input-BG, #F8F8F8)"'],
  ['color: #B3B3B3;', 'color: var(--ui-Placeholder, #737373);'],
  ['color: #333;', 'color: var(--ui-TC, #333);'],
  ['color: #333333;', 'color: var(--ui-TC, #333333);'],
]);
edit('uni_modules/uni-list/components/uni-list-item/uni-list-item.vue', [
  ["color: '#000000'", "color: 'var(--ui-TC-2, #666666)'"],
  ['background-color: $uni-bg-color-hover;', 'background-color: var(--ui-BG-2, #f1f1f1);'],
  ['color: #3b4144;', 'color: var(--ui-TC, #3b4144);'],
  ['color: $uni-text-color-grey;', 'color: var(--ui-TC-2, #777777);'],
]);
edit('sheep/ui/su-tabs/su-tabs.vue', [["color: '#303133'", "color: 'var(--shop-accent-text, #303133)'"], ["color: '#606266'", "color: 'var(--ui-TC-2, #606266)'"]]);
edit('pages/commission/withdraw.vue', [["{ disableColor: '#fff', borderColor: '#fff', color: '#333!important' }", "{ disableColor: 'var(--ui-BG)', borderColor: 'var(--ui-Border)', color: 'var(--ui-TC)' }"]]);
edit('pages/commission/components/commission-log.vue', [['color="#333333"', 'color="var(--ui-TC)"']]);
edit('sheep/components/s-point-card/s-point-card.vue', [["color: '#000'", "color: 'var(--ui-TC)'"], ["color: '#999'", "color: 'var(--ui-TC-2)'"]]);
edit('sheep/components/s-menu-button/s-menu-button.vue', [["default: '#000'", "default: 'var(--ui-TC, #000)'"]]);
edit('pages/chat/components/optimize-input.vue', [["color: '#333'", "color: 'var(--ui-TC, #333)'"], ["disableColor: '#F7F6F6'", "disableColor: 'var(--ui-Input-BG, #F7F6F6)'"], ["borderColor: '#e5e5e5'", "borderColor: 'var(--ui-Input-Border, #e5e5e5)'"]]);
