# 商城通用主题与黑金模板

## 本次修正

- 商品双列卡片使用固定 1:1 图片画布与 aspectFit，不再按原始长图比例或挂载时的像素测量值撑高；保留完整商品图、两行标题、价格与购买入口。
- 分类左右栏、选中项、分类文字和分隔线改为主题变量，消除深色主题里的白色侧栏。
- 已移除装修列表“复制为黑金”按钮及其创建方法/专用预设生成文件。没有删除、更新或启用任何数据库模板，已有复制记录继续保留。
- 配色从黑金专用覆盖改为通用主题：sheep/theme/index.js 生成语义色，sheep/scss/theme/shop.scss 定义公共组件样式；s-layout 统一注入。普通商品、订单、账户页面及自有组件中的中性表面和正文色已迁移为变量。
- 首页、个人中心、自定义装修页按“跟随主题”映射装修颜色；原装修属性不被修改。内置底栏和服务图标使用可着色图标；用户上传图片保留原素材。

## 后续换色

管理端：商城装修 → 原模板“装修” → 基础设置 → 底部导航属性。

- “主题”：使用原有预设色，黑金也是一个普通预设。
- “页面配色”：自动 / 浅色 / 深色。自动兼容黑金及已有深色首页背景。
- “自定义主色”：可填 #RRGGBB，留空采用预设色。
- “跟随主题”：默认开启，页面、DIY 公共组件的背景、正文、价格、按钮和选中态统一使用主题。关闭时允许各 DIY 组件保留自己的装修颜色。

保存仍通过原装修保存接口；新增可选字段写入原 JSON：

```json
{
  "tabBar": {
    "theme": "blue",
    "themeConfig": {
      "mode": "dark",
      "primaryColor": "#b798e8",
      "followTheme": true
    }
  }
}
```

旧模板没有 themeConfig 时使用兼容默认值，无需改表或为每个颜色增加按钮。模板原列表和“使用”流程保留。后台模板、页面分别存储于 promotion_diy_template、promotion_diy_page。

固定照片、品牌素材、富文本内写死的颜色以及业务错误/告警状态，不做整图染色。后续新增 UI 应消费现有主题变量，避免重新写死颜色。

## 验证

- Chrome H5 320px：双列商品每张约 139px 宽、285px 高，图片 139×139；未出现横向溢出。已用实际耳机长图验证方形画布。
- 实际切换黑金、浅色蓝、深色紫，验证商品背景/标题/价格/按钮，分类左右背景/选中态，个人中心文字/资产数字及底栏图标跟随变化。
- 浅色蓝价格文字自动使用对比度更好的深蓝色，按钮保留指定主色；文字色根据背景对比度生成。
- 90 个变更 Vue SFC 脚本/模板编译通过；装修模块 scoped vue-tsc 检查通过；管理端变更文件 Prettier 检查通过。
- H5 生产构建、微信小程序生产构建通过；微信产物确认为 app.json / app.js / app.wxss。
- 未进行微信开发者工具/真机全页面验收，登录、订单、结算等全部业务状态尚未逐项实测；不能将编译成功视为真机全量验收。
- 构建存在原有的 Browserslist、img 选择器及鸿蒙 UA 检测提示，未因此声称相关平台已验收。
- 本次没有对后端模板做数据写入；新增主题配置字段依赖原 JSON 属性保存链路，未额外执行数据库保存回显验证。

## 复现

```powershell
node scripts/verify-theme.cjs
powershell -ExecutionPolicy Bypass -File scripts/build-h5.ps1
powershell -ExecutionPolicy Bypass -File scripts/build-h5.ps1 -Platform mp-weixin
```

默认编译器路径 D:/HBuilderX，可通过 -HBuilderPath 指定。脚本统一使用编译器的匹配 Vue 运行库，并检查对应平台入口产物。输出在 unpackage/dist/build/h5、unpackage/dist/build/mp-weixin。

开发 H5 示例：http://localhost:3000/?themePreview=blackGold 。示例 JSON 为 static/theme/black-gold-demo.json，仅 DEV + H5 + 显式参数生效，不替代数据库模板。示例关联原测试/数码商品，不代表正式成人用品商品目录。

最新实际截图：[修正后的商品卡片](products-fixed.jpg)。此前 home-390.png / user-final.png 为历史过程截图。
